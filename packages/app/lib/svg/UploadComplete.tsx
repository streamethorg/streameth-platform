import React from 'react'

const UploadComplete: React.FC<
  React.SVGProps<SVGSVGElement>
> = () => {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_i_542_7480)">
        <rect
          width="120"
          height="120"
          rx="60"
          fill="url(#paint0_linear_542_7480)"
        />
        <rect
          x="0.5"
          y="0.5"
          width="119"
          height="119"
          rx="59.5"
          stroke="#E2E8F0"
        />
        <path
          d="M96.6668 43.332L73.3335 59.9987L96.6668 76.6654V43.332Z"
          stroke="white"
          stroke-width="6.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M66.6668 36.668H30.0002C26.3183 36.668 23.3335 39.6527 23.3335 43.3346V76.668C23.3335 80.3499 26.3183 83.3346 30.0002 83.3346H66.6668C70.3487 83.3346 73.3335 80.3499 73.3335 76.668V43.3346C73.3335 39.6527 70.3487 36.668 66.6668 36.668Z"
          stroke="white"
          stroke-width="6.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <rect
          x="88"
          y="88"
          width="32"
          height="32"
          rx="16"
          fill="#3FB570"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M112.707 97.2929C113.098 97.6834 113.098 98.3166 112.707 98.7071L101.707 109.707C101.317 110.098 100.683 110.098 100.293 109.707L95.2929 104.707C94.9024 104.317 94.9024 103.683 95.2929 103.293C95.6834 102.902 96.3166 102.902 96.7071 103.293L101 107.586L111.293 97.2929C111.683 96.9024 112.317 96.9024 112.707 97.2929Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_i_542_7480"
          x="0"
          y="0"
          width="128"
          height="126"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="8" dy="6" />
          <feGaussianBlur stdDeviation="5" />
          <feComposite
            in2="hardAlpha"
            operator="arithmetic"
            k2="-1"
            k3="1"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.531026 0 0 0 0 0.43333 0 0 0 0 0.983318 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_542_7480"
          />
        </filter>
        <linearGradient
          id="paint0_linear_542_7480"
          x1="115.932"
          y1="120.41"
          x2="51.7058"
          y2="-22.6718"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#3D22BA" />
          <stop offset="1" stop-color="#6426EF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default UploadComplete
