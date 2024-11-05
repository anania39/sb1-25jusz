// Simulated storage for web demo
const storage = {
  get: (key, callback) => {
    const value = localStorage.getItem(key);
    callback(JSON.parse(value) || {});
  },
  set: (data, callback) => {
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
    if (callback) callback();
  }
};

// AI-powered prize randomization
function getRandomReward(userStreak) {
  const rewards = [
    { type: 'small', value: '5% off', probability: 0.6 },
    { type: 'medium', value: '10% off', probability: 0.3 },
    { type: 'large', value: '20% off', probability: 0.1 },
  ];

  const streakBonus = Math.min(userStreak * 0.01, 0.1);
  rewards.forEach(reward => {
    if (reward.type === 'large') {
      reward.probability += streakBonus;
    } else if (reward.type === 'small') {
      reward.probability -= streakBonus / 2;
    }
  });

  const totalProbability = rewards.reduce((sum, reward) => sum + reward.probability, 0);
  rewards.forEach(reward => reward.probability /= totalProbability);

  const random = Math.random();
  let cumulativeProbability = 0;
  for (const reward of rewards) {
    cumulativeProbability += reward.probability;
    if (random <= cumulativeProbability) {
      return reward.value;
    }
  }

  return rewards[rewards.length - 1].value;
}

// Scratch card functionality
const canvas = document.getElementById('scratch-canvas');
const ctx = canvas.getContext('2d');
const reward = document.getElementById('reward');
const resetBtn = document.getElementById('reset-btn');
let isRevealed = false;

function initScratchCard() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.fillStyle = '#CCCCCC';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = '20px Arial';
  ctx.fillStyle = '#999999';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Scratch here!', canvas.width / 2, canvas.height / 2);

  isRevealed = false;
  reward.classList.add('hidden');
}

function revealReward(userStreak) {
  const rewardValue = getRandomReward(userStreak);
  reward.textContent = rewardValue;
  reward.classList.remove('hidden');
  isRevealed = true;

  const streakElement = document.getElementById('streak');
  const totalRewardsElement = document.getElementById('total-rewards');
  streakElement.textContent = userStreak + 1;
  totalRewardsElement.textContent = parseInt(totalRewardsElement.textContent) + 1;

  storage.set({
    streak: userStreak + 1,
    totalRewards: parseInt(totalRewardsElement.textContent)
  });
}

function scratch(e) {
  if (isRevealed) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, 2 * Math.PI);
  ctx.fill();

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const scratchedPixels = imageData.data.filter(x => x === 0).length;
  const totalPixels = imageData.data.length;
  
  if (scratchedPixels / totalPixels > 0.5) {
    storage.get('streak', function(result) {
      revealReward(result.streak || 0);
    });
  }
}

canvas.addEventListener('mousemove', scratch);
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  scratch(touch);
});

resetBtn.addEventListener('click', initScratchCard);

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  initScratchCard();
  
  storage.get(['streak', 'totalRewards'], function(result) {
    document.getElementById('streak').textContent = result.streak || 0;
    document.getElementById('total-rewards').textContent = result.totalRewards || 0;
  });
});