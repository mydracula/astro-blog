<script>
  import NavLink from '$lib/components/header/NavLink.svelte'
</script>

<ul class="menu">
  <NavLink to="/" text="Yume Shoka" type="title" />
  <NavLink to="/" text="首页" ic="ic i-home" />
  <NavLink to="javascript:void(0);" text="关于" ic="ic i-user" type="dropdown" />
  <NavLink to="javascript:void(0);" text="文章" ic="ic i-feather" type="dropdown">
    <NavLink to="/" text="归档" ic="ic i-list-alt" />
    <NavLink to="/" text="分类" ic="ic i-th" />
    <NavLink to="/" text="标签" ic="ic i-tags" />
  </NavLink>
</ul>

<ul class="right">
  <li class="item theme"><i class="ic i-sun text-1.125em!" /></li>
  <li class="item search"><i class="ic i-search" /></li>
</ul>

<style lang="scss">
  .menu {
    @apply p-y-0.625rem flex w-100\%;
  }
  .right {
    @apply inline-flex items-center justify-center;
    .item {
      @apply p-y-0.625rem p-x-0.5rem cursor-pointer;
    }
  }
</style>
