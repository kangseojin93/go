(() => {
  const file = location.pathname.split('/').pop() || 'lesson1.html';
  const match = file.match(/lesson(\d+)\.html/i);
  const lessonNumber = match ? Number(match[1]) : 1;
  const totalLessons = 100;
  const XP_PER_LESSON = 30;

  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const nextBtn = document.getElementById('nextBtn');
  const finishBtn = document.getElementById('finishBtn');
  const lessonFill = document.getElementById('lessonFill');
  const lessonPercent = document.getElementById('lessonPercent');

  function updateProgress(){
    if (!slides.length) return;
    const percent = ((currentSlide + 1) / slides.length) * 100;
    if (lessonFill) lessonFill.style.width = percent + '%';
    if (lessonPercent) lessonPercent.textContent = Math.round(percent) + '%';
    slides.forEach((slide,index)=>slide.classList.toggle('active', index === currentSlide));
    if (nextBtn) nextBtn.style.display = currentSlide === slides.length - 1 ? 'none' : 'inline-block';
    if (finishBtn) finishBtn.style.display = currentSlide === slides.length - 1 ? 'inline-block' : 'none';
  }

  window.nextSlide = function(){
    if (currentSlide < slides.length - 1) { currentSlide++; updateProgress(); }
  };

  function todayKey(){
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function yesterdayKey(){
    const d = new Date(); d.setDate(d.getDate()-1);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  window.finishLesson = function(){
    let completed = Number(localStorage.getItem('completedLessons')) || 0;
    let xp = Number(localStorage.getItem('xp')) || 0;
    let streak = Number(localStorage.getItem('streak')) || 0;
    const lastStudyDay = localStorage.getItem('lastStudyDay');
    const today = todayKey();

    // A lesson can only reward XP once.
    const doneKey = `lessonCompleted_${lessonNumber}`;
    const alreadyDone = localStorage.getItem(doneKey) === '1';

    if (!alreadyDone) {
      localStorage.setItem(doneKey, '1');
      xp += XP_PER_LESSON;
      if (lessonNumber > completed) completed = Math.min(lessonNumber, totalLessons);
    }

    // Streak is a daily streak: studying again the same day doesn't add another day.
    if (lastStudyDay !== today) {
      if (lastStudyDay === yesterdayKey()) streak = Math.max(1, streak + 1);
      else streak = Math.max(1, streak || 0);
      localStorage.setItem('lastStudyDay', today);
    }

    localStorage.setItem('completedLessons', completed);
    localStorage.setItem('nextLesson', Math.min(completed + 1, totalLessons));
    localStorage.setItem('xp', xp);
    localStorage.setItem('streak', streak);

    const save = {completedLessons: completed, xp, streak, nextLesson: Math.min(completed+1,totalLessons), lastStudyDay: today};
    localStorage.setItem('goldenBoudoirSave', JSON.stringify(save));

    alert(`🎉 وانەی ${lessonNumber} تەواو بوو!\n🔥 Streak: ${streak}\n⭐ XP: ${xp}`);
    window.location.href = 'korean.html';
  };

  updateProgress();
})();
