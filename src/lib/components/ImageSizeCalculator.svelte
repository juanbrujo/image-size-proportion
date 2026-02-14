<script>
  import Card from "./ui/Card.svelte";
  import CardHeader from "./ui/CardHeader.svelte";
  import CardTitle from "./ui/CardTitle.svelte";
  import CardDescription from "./ui/CardDescription.svelte";
  import CardContent from "./ui/CardContent.svelte";
  import Input from "./ui/Input.svelte";
  import Label from "./ui/Label.svelte";
  import Button from "./ui/Button.svelte";
  import { RefreshCw, Scaling, Calculator, Github, Upload, X } from "lucide-svelte";
  import { gcd, calculateAspectRatio, calculateTargetSize } from "../utils.js";

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
    original: calculateAspectRatio(originalWidth, originalHeight),
    target: calculateAspectRatio(manualTargetWidth, manualTargetHeight)
  });

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
  function handleCalculate() {
    if (originalWidth === 0 || originalHeight === 0) return;
    
    if (targetSizeMode === "width") {
      manualTargetHeight = calculateTargetSize(originalWidth, originalHeight, manualTargetWidth, "width");
    } else {
      manualTargetWidth = calculateTargetSize(originalWidth, originalHeight, manualTargetHeight, "height");
    }
  }

  // Reset all values to defaults
  function resetValues() {
    originalWidth = 1920;
    originalHeight = 1080;
    manualTargetWidth = 1280;
    manualTargetHeight = 720;
    targetSizeMode = "width";
    clearUploadedImage();
  }

  // Handle image upload
  let fileInput;
  let uploadedImageUrl = $state(null);
  let uploadedFileName = $state("");

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    uploadedFileName = file.name;
    
    const img = new Image();
    img.onload = function() {
      originalWidth = this.width;
      originalHeight = this.height;
      // Reset file input so same file can be selected again
      e.target.value = '';
    };
    uploadedImageUrl = URL.createObjectURL(file);
  }

  function clearUploadedImage() {
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
      uploadedImageUrl = null;
      uploadedFileName = "";
    }
  }

  function triggerFileInput() {
    fileInput.click();
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
      <p class="text-muted-foreground">Calculate proportions between two image sizes in pixels.</p>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Original Size Card -->
      <Card>
        <CardHeader>
          <CardTitle class="text-3xl flex items-center gap-2" style="font-family: var(--font-serif);font-size:">
            <span class="w-3 h-3 rounded-full bg-primary"></span>
            Original Size
          </CardTitle>
          <CardDescription class="flex items-center gap-2">
            Enter the original image dimensions or 
            <Button variant="link" size="sm" class="p-0 h-auto" style="cursor: pointer;" onclick={triggerFileInput}>
              <Upload class="w-3 h-3 mr-1" />
              upload an image
            </Button>
          </CardDescription>
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
                max="10000"
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
                max="10000"
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
            <div class="flex items-center justify-between mb-2">
              <div class="text-xs text-muted-foreground">Visual</div>
              {#if uploadedImageUrl}
                <button 
                  onclick={clearUploadedImage} 
                  class="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                >
                  <X class="w-3 h-3" />
                  Clear
                </button>
              {/if}
            </div>
            {#if uploadedImageUrl}
              <div class="flex justify-center">
                <div class="relative group">
                  <img 
                    src={uploadedImageUrl} 
                    alt="Uploaded preview"
                    class="max-w-full max-h-32 rounded border-2 border-primary/50 object-contain"
                    style="aspect-ratio: {originalWidth}/{originalHeight}"
                  />
                  <div class="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                    {uploadedFileName}
                  </div>
                </div>
              </div>
            {:else}
              <div class="flex justify-center">
                <div 
                  class="bg-primary/30 border-2 border-primary rounded flex items-center justify-center text-xs"
                  style="width: {Math.min(120, (originalWidth / originalHeight) * 80)}px; height: {Math.min(80, (originalHeight / originalWidth) * 120)}px; max-height: 80px;"
                >
                  <span class="text-[10px] text-center leading-tight">{originalWidth}×{originalHeight}</span>
                </div>
              </div>
            {/if}
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
          <CardDescription>Enter the desired target image dimension</CardDescription>
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
                max="10000"
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
                max="10000"
                placeholder="720"
                disabled={targetSizeMode !== "height"}
              />
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between">
            <Button onclick={handleCalculate} style="cursor: pointer;">
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

    <!-- Hidden file input for image upload -->
    <input
      bind:this={fileInput}
      type="file"
      accept="image/*"
      class="hidden"
      onchange={handleImageUpload}
    />

    <!-- Footer -->
    <div class="flex flex-col items-center gap-4">
      <Button onclick={resetValues} style="cursor: pointer;">
        <RefreshCw class="w-4 h-4 mr-2" />
        Reset Values
      </Button>
      <a 
        href="https://github.com/juanbrujo/image-size-proportion" 
        target="_blank" 
        rel="noopener noreferrer"
        class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>© Copyleft {new Date().getFullYear()} // Jorge Epuñan</span>
        <Github class="w-4 h-4" />
      </a>
    </div>
  </div>
</div>
