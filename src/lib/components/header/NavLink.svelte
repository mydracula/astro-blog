<script>
  export let to
  export let type = ''
  export let text
  export let ic = ''
  // import '$styles/variables.scss'
</script>

<li class="item {type}">
  <a href={to}
    >{#if ic}<i class={ic} />{/if}{text}</a
  >
  {#if type === 'dropdown'}
    <ul class="submenu">
      <slot />
    </ul>
  {/if}
</li>

<style lang="scss">
  @import '../../../styles/variables.scss';

  .item {
    @apply inline-block relative p-x-0.625rem text-center h-fit;
    letter-spacing: 0.0625rem;
    @media (max-width: 767px) {
      display: none;
      &.title {
        display: block;
        width: inherit;
      }
    }
    &:not(.dropdown):hover a::before {
      width: 70%;
    }
    .submenu .item a::before {
      width: 0;
    }
    &:not(.title) a::before {
      @apply content-none absolute w-0 h-0.1875rem bottom-0 bg-current  border-rd-0.125rem left-50\%;
      transform: translateX(-50%);
    }
    &.dropdown {
      &:hover {
        .submenu {
          display: block;
        }
      }
      > a:after {
        @apply content-empty  inline-block m-l-0.3rem v-middle border-0.3rem border-solid border-transparent b-t-current b-b-0;
      }
    }
    a {
      &:not(.title) {
        @apply block text-1em;
      }

      .ic {
        @apply m-r-0.5rem;
      }
    }
    .submenu {
      .item {
        display: block;
      }
      &:before {
        @apply absolute top--1.25rem left-0 w-100\% h-2.5rem content-empty;
      }
      &:hover {
        display: block;
      }
      @apply absolute m-t-0.5rem p-0 w-max hidden;
      background-color: var(--grey-9-a5);
      box-shadow: 0 0.3125rem 1.25rem -0.25rem var(--grey-9-a1);
      @extend .slide-up-in !optional;
      border-radius: 0.625rem 0;
      .item {
        &:hover {
          @extend .element-state !optional;
          a {
            transform: translateX(0.3rem);
          }
        }
        &:first-child {
          border-radius: 0.625rem 0 0 0;
        }
        a {
          @apply inline-block p-y-0.3rem p-x-0.7rem text-shadow-none;
        }
      }
    }
  }
</style>
