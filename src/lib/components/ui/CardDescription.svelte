<script>
  import { cn } from "$lib/utils.js";
  
  let { class: className, ...restProps } = $props();
</script>

<p class={cn("text-sm text-muted-foreground", className)} {...restProps}>
  <slot />
</p>
