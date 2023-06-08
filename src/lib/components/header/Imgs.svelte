<script>
  let className = ''
  export { className as class }
  export let covers
</script>

<div id="imgs" class={className}>
  <ul>
    <li class="item" data-background-image="https://img.timelessq.com/images/2022/07/26/4368c702fcf1129cac003f7c2f181875.jpg" />
    <li class="item" data-background-image="https://img.timelessq.com/images/2022/07/26/471188138f7f9597f65d16889f1ade0e.jpg" />
    <li class="item" data-background-image="https://img.timelessq.com/images/2022/07/26/5b5adebbec99efe0ce45af5f815b58ed.jpg" />
    <li class="item" data-background-image="https://img.timelessq.com/images/2022/07/26/dd21608b40c2387068c472909a82b3e0.jpg" />
    <li class="item" data-background-image="https://img.timelessq.com/images/2022/07/26/a8d0ac76b87f7593653e29559d61b32d.jpg" />
    <li class="item" data-background-image="https://img.timelessq.com/images/2022/07/26/9e00cb8944af8ad12fd6b7fd7eb24ebc.jpg" />
    <!-- {#each covers as image}
      <li class="lozad item" data-background-image={image} />
    {/each} -->
  </ul>
</div>

<style lang="scss">
  #imgs {
    @apply block fixed top-0 left-0 w-100\% h-70vh min-h-25rem z--9 bg-#363636;
    .item {
      @keyframes imageAnimation {
        0% {
          opacity: 0;
          animation-timing-function: ease-in;
        }
        2% {
          opacity: 1;
        }
        8% {
          opacity: 1;
          transform: scale(1.05);
          animation-timing-function: ease-out;
        }
        17% {
          opacity: 1;
          transform: scale(1.1);
        }
        25% {
          opacity: 0;
          transform: scale(1.1);
        }
        100% {
          opacity: 0;
        }
      }
      @apply w-100\% h-100\% absolute top-0 let-0 bg-cover bg-no-repeat bg-center opacity-0 z-0 backface-hidden preserve-3d;
      animation: imageAnimation 36s linear infinite 0s;

      @for $i from 1 through 6 {
        &:nth-child(#{$i + 1}) {
          animation-delay: $i * 6s;
        }
      }
    }

    &::before {
      @apply content-none block absolute w-100\% h-100\% top-0 left-0 bg-#00000033 z-1;
      transition: all 0.2s ease-in-out 0s;
    }
  }
</style>
