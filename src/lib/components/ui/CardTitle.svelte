<script>
  import { cn } from "$lib/utils.js";
  
  let { class: className, ...restProps } = $props();
</script>

<h3 class={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...restProps}>
  <slot />
</h3>
