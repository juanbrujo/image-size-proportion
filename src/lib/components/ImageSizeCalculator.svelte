<script>
  import Card from "./ui/Card.svelte";
  import CardHeader from "./ui/CardHeader.svelte";
  import CardTitle from "./ui/CardTitle.svelte";
  import CardDescription from "./ui/CardDescription.svelte";
  import CardContent from "./ui/CardContent.svelte";
  import Input from "./ui/Input.svelte";
  import Label from "./ui/Label.svelte";
  import Button from "./ui/Button.svelte";
  import { RefreshCw, Scaling, Calculator } from "lucide-svelte";

  // Original dimensions
  let originalWidth = $state(1920);
  let originalHeight = $state(1080);

  // Manual input mode
  let manualMode = $state(false);
  let manualTargetWidth = $state(1280);
  let manualTargetHeight = $state(720);

  // Radio selection for target size (width or height)
  let targetSizeMode = $state("width"); // "width" or "height"

  // Aspect ratio
  let aspectRatio = $derived({
    original: originalWidth > 0 && originalHeight > 0 ? gcd(originalWidth, originalHeight) : { w: 0, h: 0 },
    target: manualTargetWidth > 0 && manualTargetHeight > 0 ? gcd(manualTargetWidth, manualTargetHeight) : { w: 0, h: 0 }
  });

  // GCD function for aspect ratio calculation
  function gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return { w: Math.round(originalWidth / a), h: Math.round(originalHeight / a) };
  }

  // Swap dimensions
  function swapOriginal() {
    const temp = originalWidth;
    originalWidth = originalHeight;
    originalHeight = temp;
  }

  function swapTarget() {
    const temp = manualTargetWidth;
    manualTargetWidth = manualTargetHeight;
    manualTargetHeight = temp;
  }

  // Calculate the disabled dimension based on original proportion
  function calculateTargetSize() {
    if (originalWidth === 0 || originalHeight === 0) return;
    
    if (targetSizeMode === "width") {
      // Calculate height based on width using original proportion
      manualTargetHeight = Math.round((manualTargetWidth / originalWidth) * originalHeight);
    } else {
      // Calculate width based on height using original proportion
      manualTargetWidth = Math.round((manualTargetHeight / originalHeight) * originalWidth);
    }
  }
</script>

<div class="min-h-screen bg-background text-foreground p-4 md:p-8">
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="text-center space-y-2 mb-8">
      <div class="flex items-center justify-center gap-2">
        <Scaling class="w-8 h-8 text-primary" />
        <h1 class="text-3xl font-bold tracking-tight" style="font-family: var(--font-serif);font-size:2.6rem;">Image Size Proportion Calculator</h1>
      </div>
      <p class="text-muted-foreground">Calculate proportions between two image sizes in pixels</p>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Original Size Card -->
      <Card>
        <CardHeader>
          <CardTitle class="text-3xl flex items-center gap-2" style="font-family: var(--font-serif);font-size:">
            <span class="w-3 h-3 rounded-full bg-primary"></span>
            Original Size
          </CardTitle>
          <CardDescription>Enter the original image dimensions</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="orig-width">Width (px)</Label>
              <Input 
                id="orig-width" 
                type="number" 
                bind:value={originalWidth} 
                min="1"
                placeholder="1920" 
              />
            </div>
            <div class="space-y-2">
              <Label for="orig-height">Height (px)</Label>
              <Input 
                id="orig-height" 
                type="number" 
                bind:value={originalHeight} 
                min="1"
                placeholder="1080" 
              />
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between">
            <span class="text-sm text-muted-foreground">
              Aspect Ratio: <span class="text-foreground font-mono">{aspectRatio.original.w}:{aspectRatio.original.h}</span>
            </span>
            <Button variant="ghost" size="sm" onclick={swapOriginal} style="cursor: pointer;">
              <RefreshCw class="w-4 h-4 mr-1" />
              Swap
            </Button>
          </div>
          <!-- Visual Representation -->
          <div class="mt-4 p-3 rounded-lg bg-muted/30 border">
            <div class="text-xs text-muted-foreground mb-2">Visual</div>
            <div class="flex justify-center">
              <div 
                class="bg-primary/30 border-2 border-primary rounded flex items-center justify-center text-xs"
                style="width: {Math.min(120, (originalWidth / originalHeight) * 80)}px; height: {Math.min(80, (originalHeight / originalWidth) * 120)}px; max-height: 80px;"
              >
                <span class="text-[10px] text-center leading-tight">{originalWidth}×{originalHeight}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Target Size Card -->
      <Card>
        <CardHeader>
          <CardTitle class="text-3xl flex items-center gap-2" style="font-family: var(--font-serif);">
            <span class="w-3 h-3 rounded-full bg-secondary"></span>
            Target Size
          </CardTitle>
          <CardDescription>Enter the target image dimensions</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label class="flex items-center gap-2">
                <input type="radio" name="target-size" value="width" checked={targetSizeMode === "width"} onchange={() => targetSizeMode = "width"} /> Width (px)
              </Label>
              <Input 
                id="target-width" 
                type="number" 
                bind:value={manualTargetWidth} 
                min="1"
                placeholder="1280"
                disabled={targetSizeMode !== "width"}
              />
            </div>
            <div class="space-y-2">
              <Label class="flex items-center gap-2">
                <input type="radio" name="target-size" value="height" checked={targetSizeMode === "height"} onchange={() => targetSizeMode = "height"} /> Height (px)
              </Label>
              <Input 
                id="target-height" 
                type="number" 
                bind:value={manualTargetHeight} 
                min="1"
                placeholder="720"
                disabled={targetSizeMode !== "height"}
              />
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between">
            <Button onclick={calculateTargetSize} style="cursor: pointer;">
              <Calculator class="w-4 h-4 mr-2" />
              Calculate
            </Button>
            <Button variant="ghost" size="sm" onclick={swapTarget} style="cursor: pointer;">
              <RefreshCw class="w-4 h-4 mr-1" />
              Swap
            </Button>
          </div>
          <!-- Visual Representation -->
          <div class="mt-4 p-3 rounded-lg bg-muted/30 border">
            <div class="text-xs text-muted-foreground mb-2">Visual</div>
            <div class="flex justify-center">
              <div 
                class="bg-secondary/30 border-2 border-secondary rounded flex items-center justify-center text-xs"
                style="width: {Math.min(120, (manualTargetWidth / manualTargetHeight) * 80)}px; height: {Math.min(80, (manualTargetHeight / manualTargetWidth) * 120)}px; max-height: 80px;"
              >
                <span class="text-[10px] text-center leading-tight">{manualTargetWidth}×{manualTargetHeight}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Footer -->
    <div class="text-center text-sm text-muted-foreground">
      Enter dimensions to calculate proportions in real-time
    </div>
  </div>
</div>
