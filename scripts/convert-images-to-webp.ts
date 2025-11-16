import { readdir, readFile, writeFile, mkdir, rename } from "fs/promises";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const POSTS_IMAGES_DIR = join(__dirname, "../public/assets/images/posts");
const POSTS_CONTENT_DIR = join(__dirname, "../src/content/posts");
const RAW_DIR = join(POSTS_IMAGES_DIR, "_raw");

/**
 * Converts a PNG file to WebP format
 */
async function convertPngToWebp(pngPath: string): Promise<string> {
  const webpPath = pngPath.replace(/\.png$/i, ".webp");

  await sharp(pngPath).webp({ quality: 85 }).toFile(webpPath);

  return webpPath;
}

/**
 * Updates MDX frontmatter to replace .png with .webp in image paths
 */
function updateMdxFrontmatter(content: string): string {
  // Match frontmatter section (between --- markers)
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return content; // No frontmatter found, return as-is
  }

  const frontmatter = match[1];
  const restOfContent = content.slice(match[0].length);

  // Replace .png with .webp in the frontmatter (this will update imageLight and imageDark paths)
  const updatedFrontmatter = frontmatter.replace(/\.png/g, ".webp");

  return `---\n${updatedFrontmatter}\n---${restOfContent}`;
}

/**
 * Main conversion function
 */
async function main() {
  try {
    console.log("Starting PNG to WebP conversion...\n");

    // Step 1: Convert PNG images to WebP
    console.log("Step 1: Converting PNG images to WebP...");
    const files = await readdir(POSTS_IMAGES_DIR);
    const pngFiles = files.filter((file) =>
      file.toLowerCase().endsWith(".png"),
    );

    if (pngFiles.length === 0) {
      console.log("No PNG files found in posts directory.");
      return;
    }

    const convertedFiles: string[] = [];
    const convertedPngFiles: string[] = [];
    for (const pngFile of pngFiles) {
      const pngPath = join(POSTS_IMAGES_DIR, pngFile);
      try {
        const webpPath = await convertPngToWebp(pngPath);
        const webpFileName = basename(webpPath);
        convertedFiles.push(webpFileName);
        convertedPngFiles.push(pngFile);
        console.log(`  ✓ Converted: ${pngFile} → ${webpFileName}`);
      } catch (error) {
        console.error(`  ✗ Failed to convert ${pngFile}:`, error);
      }
    }

    console.log(
      `\nConverted ${convertedFiles.length} image(s) to WebP format.\n`,
    );

    // Step 2: Move original PNGs to _raw subdirectory
    if (convertedPngFiles.length > 0) {
      console.log("Step 2: Moving original PNG files to _raw subdirectory...");
      try {
        await mkdir(RAW_DIR, { recursive: true });
      } catch (error) {
        // Directory might already exist, that's fine
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
          throw error;
        }
      }

      let movedCount = 0;
      for (const pngFile of convertedPngFiles) {
        const pngPath = join(POSTS_IMAGES_DIR, pngFile);
        const rawPngPath = join(RAW_DIR, pngFile);
        try {
          await rename(pngPath, rawPngPath);
          movedCount++;
          console.log(`  ✓ Moved: ${pngFile} → _raw/${pngFile}`);
        } catch (error) {
          console.error(`  ✗ Failed to move ${pngFile}:`, error);
        }
      }

      console.log(`\nMoved ${movedCount} PNG file(s) to _raw subdirectory.\n`);
    }

    // Step 3: Update MDX files
    console.log("Step 3: Updating MDX frontmatter references...");
    const mdxFiles = await readdir(POSTS_CONTENT_DIR);
    const mdxFilesList = mdxFiles.filter((file) => file.endsWith(".mdx"));

    if (mdxFilesList.length === 0) {
      console.log("No MDX files found in posts directory.");
      return;
    }

    let updatedCount = 0;
    for (const mdxFile of mdxFilesList) {
      const mdxPath = join(POSTS_CONTENT_DIR, mdxFile);
      try {
        const content = await readFile(mdxPath, "utf-8");
        const updatedContent = updateMdxFrontmatter(content);

        if (content !== updatedContent) {
          await writeFile(mdxPath, updatedContent, "utf-8");
          updatedCount++;
          console.log(`  ✓ Updated: ${mdxFile}`);
        } else {
          console.log(`  - No changes needed: ${mdxFile}`);
        }
      } catch (error) {
        console.error(`  ✗ Failed to update ${mdxFile}:`, error);
      }
    }

    console.log(`\nUpdated ${updatedCount} MDX file(s).`);
    console.log("\n✓ Conversion complete!");
  } catch (error) {
    console.error("Error during conversion:", error);
    process.exit(1);
  }
}

main();
