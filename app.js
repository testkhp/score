// app.js
document.addEventListener('DOMContentLoaded', () => {
  const loginContainer = document.getElementById('loginContainer');
  const dashboardContainer = document.getElementById('dashboardContainer');
  const loginBtn = document.getElementById('loginBtn');
  const backToMainBtn = document.getElementById('backToMainBtn');
  const errorMsg = document.getElementById('errorMsg');
  const gridContainer = document.getElementById('gridContainer');
  const studentNameDisplay = document.getElementById('studentNameDisplay');
  const averageDisplay = document.getElementById('averageDisplay');
  const studentSelect = document.getElementById('studentSelect');
  const passwordInput = document.getElementById('passwordInput');

  // 로그인(조회) 버튼 클릭 시
  loginBtn.addEventListener('click', () => {
    const selectedName = studentSelect.value;
    const inputPassword = passwordInput.value;

    if (!selectedName || !inputPassword) {
      alert('이름과 비밀번호를 모두 입력해주세요.');
      return;
    }

    const student = studentData.find(s => s.name === selectedName);

    if (student && student.password === inputPassword) {
      errorMsg.style.display = 'none';
      renderDashboard(student);
    } else {
      errorMsg.style.display = 'block';
    }
  });

  // 메인 화면으로 돌아가기 버튼 클릭 시
  backToMainBtn.addEventListener('click', () => {
    dashboardContainer.classList.add('hidden');
    loginContainer.style.display = 'block';
    
    studentSelect.value = '';
    passwordInput.value = '';
    errorMsg.style.display = 'none';
  });

  // 대시보드 렌더링 함수
  function renderDashboard(student) {
    loginContainer.style.display = 'none';
    dashboardContainer.classList.remove('hidden');

    studentNameDisplay.textContent = `${student.name} 훈련생 평가 결과`;

    let totalScore = 0;
    const subjectsCount = student.subjects.length;
    
    gridContainer.innerHTML = ''; 
    student.subjects.forEach(sub => {
      totalScore += sub.score;
      
      // ✅ 요청하신 '평가교과목'과 '평가일자' 텍스트가 추가된 부분입니다.
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
    averageDisplay.textContent = `📈 통합 평균 : ${average}점`;
  }

  // --- 브라우저 기본 기능 차단 (보안용) ---
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  document.addEventListener('keydown', function(e) {
    if (e.keyCode === 123) {
      e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
      e.preventDefault();
    }
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
    }
  });
});