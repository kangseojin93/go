const TOTAL_LESSONS = 100;
const completedLessons = Number(localStorage.getItem('completedLessons')) || 0;
const xp = Number(localStorage.getItem('xp')) || 0;
const streak = Number(localStorage.getItem('streak')) || 0;
const nextLesson = Number(localStorage.getItem('nextLesson')) || Math.min(completedLessons + 1, TOTAL_LESSONS);

const level = Math.floor(xp / 100) + 1;
const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
setText('level', 'Lv.' + level);
setText('xp', xp);
setText('streak', streak);
setText('lessonCount', `${completedLessons} / ${TOTAL_LESSONS}`);

const topics = [
  ['Topic 1', 'هانگول و بنەماکانی زمانی کۆری'],
  ['Topic 2', 'وشە و دەستەواژە سەرەتاییەکان'],
  ['Topic 3', 'ڕستەسازی و خۆناساندن'],
  ['Topic 4', 'وشەکانی ڕۆژانە و گفتوگۆ'],
  ['Topic 5', 'پیشە و بابەتەکانی ژیان']
];
const topicIndex = Math.min(Math.floor(Math.max(completedLessons, 0) / 20), topics.length - 1);
setText('topicTitle', topics[topicIndex][0]);
setText('topicDescription', topics[topicIndex][1]);

const progressFill = document.querySelector('.progressFill');
const progressText = document.getElementById('progressText');
const percent = Math.round((completedLessons / TOTAL_LESSONS) * 100);
if (progressFill) progressFill.style.width = percent + '%';
if (progressText) progressText.textContent = percent + '%';

// Existing lesson cards: make them reflect the real saved progress.
document.querySelectorAll('.lessonCard').forEach(card => {
  const circle = card.querySelector('.lessonCircle');
  const n = circle ? Number(circle.textContent.trim()) : 0;
  if (!n) return;
  card.classList.remove('completed','current','locked');
  if (n <= completedLessons) {
    card.classList.add('completed');
    const p = card.querySelector('p'); if (p && !p.textContent.includes('✅')) p.textContent += ' ✅';
  } else if (n === nextLesson) {
    card.classList.add('current');
  } else if (n > completedLessons + 1) {
    card.classList.add('locked');
    card.addEventListener('click', e => { e.preventDefault(); alert('🔒 سەرەتا وانەی پێشوو تەواو بکە.'); });
  }
});

// 100-lesson path
const lessonPath = document.getElementById('lessonPath');
if (lessonPath) {
  lessonPath.innerHTML = '';
  for (let i=1;i<=TOTAL_LESSONS;i++) {
    const node = document.createElement('div');
    node.className='lessonNode';
    node.dataset.lesson=i;
    node.textContent = i <= completedLessons ? '✅' : (i === nextLesson ? String(i) : '🔒');
    if (i <= completedLessons) node.classList.add('completed');
    else if (i === nextLesson) node.classList.add('current');
    else node.classList.add('locked');
    if (i <= completedLessons + 1 && i <= 5) {
      node.addEventListener('click',()=>location.href=`lesson${i}.html`);
    }
    lessonPath.appendChild(node);
    if (i < TOTAL_LESSONS) {
      const line=document.createElement('div'); line.className='pathLine'; lessonPath.appendChild(line);
    }
  }
}

// Keep a restorable copy of progress.
localStorage.setItem('goldenBoudoirSave', JSON.stringify({completedLessons,xp,streak,nextLesson,lastStudyDay:localStorage.getItem('lastStudyDay')}));
