<template>
    <svg v-if="activeKey === '1'" width="34" height="24" viewBox="0 0 34 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_1511_27442)">
        <rect x="2" y="2" width="25" height="20" rx="6" fill="white"/>
        <path d="M22 18H11.0667C10.6933 18 10.5066 18 10.364 17.9273C10.2386 17.8634 10.1366 17.7614 10.0727 17.636C10 17.4934 10 17.3067 10 16.9333V6M21.3333 9.33333L18.7208 12.1218C18.6217 12.2274 18.5722 12.2803 18.5125 12.3076C18.4598 12.3317 18.4017 12.3416 18.344 12.3364C18.2786 12.3305 18.2143 12.2972 18.0858 12.2304L15.9142 11.1029C15.7857 11.0362 15.7214 11.0028 15.656 10.9969C15.5983 10.9917 15.5402 11.0016 15.4875 11.0257C15.4278 11.053 15.3783 11.1059 15.2792 11.2116L12.6667 14" stroke="#162138" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
        <filter id="filter0_d_1511_27442" x="-2" y="0" width="34" height="24" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="2"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.121569 0 0 0 0 0.152941 0 0 0 0 0.184314 0 0 0 0.1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1511_27442"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1511_27442" result="shape"/>
        </filter>
      </defs>
    </svg>

  <svg v-else width="34" height="22" viewBox="0 0 34 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 16H9.06667C8.6933 16 8.50661 16 8.36401 15.9273C8.23856 15.8634 8.13658 15.7614 8.07266 15.636C8 15.4934 8 15.3067 8 14.9333V4M19.3333 7.33333L16.7208 10.1218C16.6217 10.2274 16.5722 10.2803 16.5125 10.3076C16.4598 10.3317 16.4017 10.3416 16.344 10.3364C16.2786 10.3305 16.2143 10.2972 16.0858 10.2304L13.9142 9.10288C13.7857 9.03615 13.7214 9.00278 13.656 8.99689C13.5983 8.99169 13.5402 9.00163 13.4875 9.02574C13.4278 9.05305 13.3783 9.10589 13.2792 9.21156L10.6667 12" stroke="#8393A9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>


<script setup>

const {activeKey}= defineProps(['activeKey'])

</script>