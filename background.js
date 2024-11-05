// Set up daily alarm for new scratch card
chrome.alarms.create('dailyScratchCard', {
  periodInMinutes: 1440 // 24 hours
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyScratchCard') {
    // Reset scratch card and notify user
    chrome.storage.local.set({ cardScratched: false }, () => {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon128.png',
        title: 'New Scratch Card Available!',
        message: 'Your daily scratch card is ready. Open the extension to play!'
      });
    });
  }
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateStats') {
    // Update user stats and trigger AI analysis (simplified)
    chrome.storage.local.get(['userStats'], (result) => {
      const stats = result.userStats || { interactions: 0, rewards: [] };
      stats.interactions++;
      stats.rewards.push(request.reward);
      
      // Simulated AI analysis
      const engagementScore = calculateEngagementScore(stats);
      const recommendedAds = getRecommendedAds(stats, engagementScore);
      
      chrome.storage.local.set({ userStats: stats, recommendedAds: recommendedAds }, () => {
        sendResponse({ success: true, engagementScore: engagementScore });
      });
    });
    return true; // Indicates async response
  }
});

// Simulated AI functions (these would be more complex in a real implementation)
function calculateEngagementScore(stats) {
  return Math.min(stats.interactions * 0.1, 10); // Simple score based on interactions, max 10
}

function getRecommendedAds(stats, engagementScore) {
  // Simplified ad recommendation based on engagement score
  if (engagementScore > 7) {
    return ['premium_ad_1', 'premium_ad_2'];
  } else if (engagementScore > 3) {
    return ['standard_ad_1', 'standard_ad_2'];
  } else {
    return ['basic_ad_1'];
  }
}