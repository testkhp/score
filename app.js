document.addEventListener('DOMContentLoaded', () => {
  const loginContainer = document.getElementById('loginContainer');
  const dashboardContainer = document.getElementById('dashboardContainer');
  const adminContainer = document.getElementById('adminContainer');
  const loginBtn = document.getElementById('loginBtn');
  const backToMainBtns = document.querySelectorAll('.backToMainBtn');
  const errorMsg = document.getElementById('errorMsg');
  
  const studentSelect = document.getElementById('studentSelect');
  const passwordInput = document.getElementById('passwordInput');

  // 관리자 전용 확인 암호
  const ADMIN_PASSWORD = "233712"; 

  // 로그인(조회) 작동 제어
  loginBtn.addEventListener('click', () => {
    const selectedName = studentSelect.value;
    const inputPassword = passwordInput.value;

    if (!selectedName || !inputPassword) {
      alert('이름과 비밀번호를 모두 입력해주세요.');
      return;
    }

    // 1. 관리자 전용 테이블 뷰어 로그인 처리
    if (selectedName === 'admin') {
      if (inputPassword === ADMIN_PASSWORD) {
        errorMsg.style.display = 'none';
        renderAdminDashboard();
      } else {
        errorMsg.style.display = 'block';
      }
      return;
    }

    // 2. 개별 수강생 전용 대시보드 로그인 처리
    const student = studentData.find(s => s.name === selectedName);
    if (student && student.password === inputPassword) {
      errorMsg.style.display = 'none';
      renderStudentDashboard(student);
    } else {
      errorMsg.style.display = 'block';
    }
  });

  // 메인 화면으로 가기 버튼 액션 처리 (데이터 리셋 포함)
  backToMainBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dashboardContainer.classList.add('hidden');
      adminContainer.classList.add('hidden');
      loginContainer.style.display = 'block';
      
      studentSelect.value = '';
      passwordInput.value = '';
      errorMsg.style.display = 'none';
    });
  });

  // 학생 개인 대시보드 동적 화면 빌드
  function renderStudentDashboard(student) {
    loginContainer.style.display = 'none';
    dashboardContainer.classList.remove('hidden');

    document.getElementById('studentNameDisplay').textContent = `${student.name} 훈련생 평가 결과`;

    let totalScore = 0;
    const subjectsCount = student.subjects.length;
    const gridContainer = document.getElementById('gridContainer');
    
    gridContainer.innerHTML = ''; 
    student.subjects.forEach(sub => {
      totalScore += sub.score;
      
      const cardHTML = `
        <div class="card">
          <div class="card-header">
            <h3 class="subject-name">평가교과목 : ${sub.name}</h3>
            <span class="subject-date">평가일자 : ${sub.date}</span>
            <p class="subject-score">${sub.score}점</p>
          </div>
          <div class="subject-feedback">${sub.feedback}</div>
        </div>
      `;
      gridContainer.insertAdjacentHTML('beforeend', cardHTML);
    });

    const average = subjectsCount > 0 ? (totalScore / subjectsCount).toFixed(2) : 0;
    document.getElementById('averageDisplay').textContent = `📈 통합 평균 : ${average}점`;
  }

  // 관리자 전용 전체 수강생 일괄 성적표 빌드
  function renderAdminDashboard() {
    loginContainer.style.display = 'none';
    adminContainer.classList.remove('hidden');

    const table = document.getElementById('adminTable');
    table.innerHTML = '';

    if (studentData.length === 0) return;

    // 테이블 상단 헤더 동적 생성
    const subjectNames = studentData[0].subjects.map(sub => sub.name);
    let theadHTML = `<thead><tr><th>이름</th>`;
    subjectNames.forEach(name => {
      theadHTML += `<th>${name}</th>`;
    });
    theadHTML += `<th>통합 평균</th></tr></thead>`;
    
    // 테이블 학생별 성적 데이터 바인딩
    let tbodyHTML = `<tbody>`;
    studentData.forEach(student => {
      let rowHTML = `<tr><td><strong>${student.name}</strong></td>`;
      let totalScore = 0;
      
      student.subjects.forEach(sub => {
        rowHTML += `<td>${sub.score}</td>`;
        totalScore += sub.score;
      });
      
      const average = student.subjects.length > 0 ? (totalScore / student.subjects.length).toFixed(2) : 0;
      rowHTML += `<td class="highlight-avg">${average}</td></tr>`;
      tbodyHTML += rowHTML;
    });
    tbodyHTML += `</tbody>`;

    table.innerHTML = theadHTML + tbodyHTML;
  }

  // --- 소스코드 무단 조회 및 불펌 불심 방지 락 해제 제어 ---
  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
  document.addEventListener('keydown', function(e) {
    if (e.keyCode === 123) { e.preventDefault(); }
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) { e.preventDefault(); }
    if (e.ctrlKey && e.keyCode === 85) { e.preventDefault(); }
  });
});
