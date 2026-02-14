<script>
  import { cn } from "$lib/utils.js";
  
  let { class: className, type = "text", value = $bindable(""), min = 1, max = 10000, ...restProps } = $props();

  function handleKeyDown(e) {
    if (type === "number") {
      // Prevent e, E, +, - characters
      if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
        e.preventDefault();
      }
    }
  }

  function handleInput(e) {
    if (type === "number") {
      const inputValue = e.target.value;
      
      if (inputValue === "") {
        value = "";
      } else {
        let numValue = Number(inputValue);
        
        // Clamp value between min and max
        if (numValue < min) numValue = min;
        if (numValue > max) numValue = max;
        
        value = numValue;
      }
    } else {
      value = e.target.value;
    }
  }
</script>

<input
  type={type}
  value={value}
  oninput={handleInput}
  onkeydown={handleKeyDown}
  {min}
  {max}
  class={cn(
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    className
  )}
  {...restProps}
/>
