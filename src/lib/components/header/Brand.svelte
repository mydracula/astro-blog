<script></script>

<div id="brand">
  <div class="wrapper">
    <a href="/" class="logo">
      <p class="artboard">Yume Shoka</p>
      <h1 class="title">優萌初華</h1>
    </a>
    <p class="meta">= 有夢書架 =</p>
  </div>
</div>

<style lang="scss">
  #brand {
    @include mixin-flex();
    @media (max-width: 767px) {
      padding: 3rem 0.5rem 0;
    }
    @apply fixed text-center w-100\% h-50vh min-h-10rem box-border;
    padding: 3rem 5rem 0;
    h1 {
      font-size: 2.5em;
      letter-spacing: 0.125rem;
      @media (max-width: 767px) {
        font-size: 1.5em;
      }
    }
    .wrapper {
      @include mixin-flex();
      .logo {
        .artboard {
          @media (max-width: 413px) {
            font-size: 2.5em;
          }
          @apply text-3.5em;
          line-height: 1.2;
          font-family: 'Fredericka the Great', Mulish, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
          + h1 {
            margin: 0.625rem 0;
          }
        }
      }
      .meta {
        @apply flex m-0 text-0.865em;
        @media (max-width: 767px) {
          font-size: 0.75em;
        }
      }
    }
  }
</style>
