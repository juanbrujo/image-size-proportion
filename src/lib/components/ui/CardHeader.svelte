<script>
  import { cn } from "$lib/utils.js";
  
  let { class: className, ...restProps } = $props();
</script>

<div class={cn("flex flex-col space-y-1.5 p-6", className)} {...restProps}>
  <slot />
</div>
