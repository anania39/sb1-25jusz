<template>
  <div class="bg-gray-100 p-4 min-h-screen">
    <div v-if="!isAuthenticated" class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-8">
        <h1 class="text-2xl font-bold text-center mb-4">Login to Access Your Daily Scratch Card</h1>
        <button @click="authenticateWithGoogle" class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
          Login with Google
        </button>
      </div>
    </div>
    <div v-else class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-8">
        <h1 class="text-2xl font-bold text-center mb-4">Daily Scratch Card</h1>
        <div v-if="!hasPlayedToday">
          <div id="scratch-card" class="relative w-full h-64 bg-gray-300 rounded-lg overflow-hidden">
            <canvas ref="scratchCanvas" class="absolute top-0 left-0 w-full h-full"></canvas>
            <div v-if="isRevealed" class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-3xl font-bold">
              {{ reward }}
            </div>
          </div>
          <button @click="resetCard" class="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">Reset Card</button>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-xl font-semibold">You've already played today!</p>
          <p>Come back tomorrow for a new scratch card.</p>
        </div>
      </div>
      <div class="px-8 py-4 bg-gray-50">
        <h2 class="text-xl font-semibold mb-2">Your Stats</h2>
        <p>Streak: <span>{{ streak }}</span> days</p>
        <p>Total Rewards: <span>{{ totalRewards }}</span></p>
      </div>
      <div class="px-8 py-4">
        <h2 class="text-xl font-semibold mb-2">Your Coupons</h2>
        <ul class="list-disc pl-5">
          <li v-for="(coupon, index) in coupons" :key="index" class="mb-2">
            {{ coupon.description }} - Expires: {{ coupon.expiryDate }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const scratchCanvas = ref(null)
    const isRevealed = ref(false)
    const reward = ref('')
    const streak = ref(0)
    const totalRewards = ref(0)
    const isAuthenticated = ref(false)
    const hasPlayedToday = ref(false)
    const coupons = ref([])

    const getRandomReward = (userStreak) => {
      const rewards = [
        { type: 'small', value: '5% off', probability: 0.6 },
        { type: 'medium', value: '10% off', probability: 0.3 },
        { type: 'large', value: '20% off', probability: 0.1 },
      ]

      const streakBonus = Math.min(userStreak * 0.01, 0.1)
      rewards.forEach(r => {
        if (r.type === 'large') {
          r.probability += streakBonus
        } else if (r.type === 'small') {
          r.probability -= streakBonus / 2
        }
      })

      const totalProbability = rewards.reduce((sum, r) => sum + r.probability, 0)
      rewards.forEach(r => r.probability /= totalProbability)

      const random = Math.random()
      let cumulativeProbability = 0
      for (const r of rewards) {
        cumulativeProbability += r.probability
        if (random <= cumulativeProbability) {
          return r.value
        }
      }

      return rewards[rewards.length - 1].value
    }

    const initScratchCard = () => {
      const canvas = scratchCanvas.value
      const ctx = canvas.getContext('2d')
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      ctx.fillStyle = '#CCCCCC'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = '20px Arial'
      ctx.fillStyle = '#999999'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Scratch here!', canvas.width / 2, canvas.height / 2)

      isRevealed.value = false
    }

    const revealReward = () => {
      reward.value = getRandomReward(streak.value)
      isRevealed.value = true
      streak.value++
      totalRewards.value++
      hasPlayedToday.value = true
      
      // Add new coupon
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 7) // Coupon expires in 7 days
      coupons.value.push({
        description: reward.value,
        expiryDate: expiryDate.toLocaleDateString()
      })

      // Save data
      localStorage.setItem('streak', streak.value)
      localStorage.setItem('totalRewards', totalRewards.value)
      localStorage.setItem('lastPlayedDate', new Date().toDateString())
      localStorage.setItem('coupons', JSON.stringify(coupons.value))
    }

    const scratch = (e) => {
      if (isRevealed.value) return

      const canvas = scratchCanvas.value
      const ctx = canvas.getContext('2d')
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(x, y, 20, 0, 2 * Math.PI)
      ctx.fill()

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const scratchedPixels = imageData.data.filter(x => x === 0).length
      const totalPixels = imageData.data.length
      
      if (scratchedPixels / totalPixels > 0.5) {
        revealReward()
      }
    }

    const resetCard = () => {
      initScratchCard()
    }

    const authenticateWithGoogle = () => {
      // Simulated Google authentication
      isAuthenticated.value = true
      loadUserData()
    }

    const loadUserData = () => {
      streak.value = parseInt(localStorage.getItem('streak') || '0')
      totalRewards.value = parseInt(localStorage.getItem('totalRewards') || '0')
      coupons.value = JSON.parse(localStorage.getItem('coupons') || '[]')

      const lastPlayedDate = localStorage.getItem('lastPlayedDate')
      hasPlayedToday.value = lastPlayedDate === new Date().toDateString()

      if (!hasPlayedToday.value) {
        initScratchCard()
      }
    }

    onMounted(() => {
      if (scratchCanvas.value) {
        scratchCanvas.value.addEventListener('mousemove', scratch)
        scratchCanvas.value.addEventListener('touchmove', (e) => {
          e.preventDefault()
          const touch = e.touches[0]
          scratch(touch)
        })
      }
    })

    return {
      scratchCanvas,
      isRevealed,
      reward,
      streak,
      totalRewards,
      resetCard,
      isAuthenticated,
      authenticateWithGoogle,
      hasPlayedToday,
      coupons
    }
  }
}
</script>