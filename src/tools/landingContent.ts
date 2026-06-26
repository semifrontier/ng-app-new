export type ToolLandingContent = {
  heading: string;
  summary: string;
  useCases: string[];
  workflowSteps?: string[];
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
};

export const TOOL_LANDING_CONTENT: Record<string, ToolLandingContent> = {
  "campaign-url-architect": {
    heading: "Build campaign links without losing the naming system.",
    summary:
      "Campaign URL Architect turns a destination URL and campaign details into a clean tracked link, then keeps recent links in local history so recurring campaigns stay consistent.",
    useCases: [
      "Preparing paid, email, social, or partner campaign URLs before launch.",
      "Checking that UTM values are present, readable, and free of stray spaces.",
      "Reusing previous campaign structures without keeping a separate spreadsheet open.",
    ],
    workflowSteps: [
      "Paste the final landing page URL first so the campaign link starts from the right destination.",
      "Fill in source, medium, campaign, term, and content values using the team's naming pattern.",
      "Copy the finished URL and keep the generated history entry for the next campaign.",
    ],
    faqs: [
      {
        question: "Does Campaign URL Architect use GA4 campaign parameters?",
        answer:
          "Yes. The generated URL uses the standard utm_campaign field along with source, medium, term, and content values when those fields are filled in.",
      },
      {
        question: "Can I reuse old campaign naming patterns?",
        answer:
          "Recent links are stored locally so recurring channels, naming conventions, and campaign structures can be rebuilt without opening a separate tracker.",
      },
    ],
  },
  "case-converter": {
    heading: "Convert uppercase to lowercase before text ships.",
    summary:
      "Case Converter reformats pasted text into lowercase, uppercase, title case, sentence case, camel case, and slug-ready formats for content cleanup work.",
    useCases: [
      "Changing all-caps notes, headings, labels, or exports into readable lowercase text.",
      "Turning rough notes into title case, sentence case, camel case, or slug-ready text.",
      "Normalizing lists of labels before moving them into a CMS, design file, or codebase.",
    ],
    workflowSteps: [
      "Paste the source text exactly as it came from the note, CMS, spreadsheet, or design file.",
      "Choose lowercase, uppercase, title case, sentence case, camel case, kebab case, or snake case for the destination system.",
      "Copy the cleaned output and repeat with the next batch of labels or strings.",
    ],
    faqs: [
      {
        question: "Can I convert uppercase text to lowercase?",
        answer:
          "Yes. Paste the all-caps text, choose lowercase, and copy the converted result without changing the original wording.",
      },
      {
        question: "What casing formats are best for content cleanup?",
        answer:
          "Sentence case and title case are useful for visible copy, while camel case, pascal case, kebab case, and snake case work better for code-adjacent strings and filenames.",
      },
      {
        question: "Does Case Converter change the meaning of the text?",
        answer:
          "No. It reformats casing and spacing so copied text can move into another tool without a manual cleanup pass.",
      },
    ],
  },
  "color-palette-generator": {
    heading: "Shape a palette before committing it to a design system.",
    summary:
      "Color Palette Generator helps explore color combinations, contrast, gradients, mockups, image inspiration, and saved palettes from one browser workspace.",
    useCases: [
      "Starting brand, landing page, dashboard, or campaign color exploration.",
      "Previewing how a palette behaves in realistic UI and visual compositions.",
      "Exporting reusable color values once the direction feels right.",
    ],
    workflowSteps: [
      "Start with a generated palette, image-inspired palette, or a color you already know.",
      "Review harmony, contrast, gradient, and mockup views before committing to the set.",
      "Export the color values for design tokens, CSS, decks, or brand documentation.",
    ],
    faqs: [
      {
        question: "Can Color Palette Generator help with brand palettes?",
        answer:
          "Yes. It is built for early palette exploration, contrast review, mockup previewing, and exporting reusable color values once the direction is ready.",
      },
      {
        question: "When should I use the mockup views?",
        answer:
          "Use mockup views before final export to see whether the palette still works in interface, marketing, and visual contexts instead of only as isolated swatches.",
      },
    ],
  },
  "color-picker": {
    heading: "Extract HEX color codes from the image in front of you.",
    summary:
      "Color Picker works as an image-to-hex tool, sampling HEX, RGB, and HSL values from uploaded images with a zoomed canvas so reference colors can move straight into design or development.",
    useCases: [
      "Matching a HEX color from a screenshot, logo, product photo, or moodboard.",
      "Checking nearby pixels with a magnified view before copying the final value.",
      "Translating visual references into usable CSS or design-token color formats.",
    ],
    workflowSteps: [
      "Upload the image or screenshot that contains the color you need to match.",
      "Use the magnified picker to sample the exact pixel or compare nearby options.",
      "Copy the HEX, RGB, or HSL value into your CSS, design system, or palette notes.",
    ],
    faqs: [
      {
        question: "Can Color Picker pull a HEX code from a screenshot?",
        answer:
          "Yes. Upload the screenshot, sample the target pixel, and copy the HEX value for design or front-end use.",
      },
      {
        question: "Why does one image area produce slightly different colors?",
        answer:
          "Anti-aliasing, shadows, compression, and gradients can change nearby pixels. The zoomed picker helps compare those pixels before copying the final value.",
      },
    ],
  },
  dictate: {
    heading: "Capture spoken notes while the thought is still moving.",
    summary:
      "Dictate provides a local speech-to-text workspace with editable transcripts, playback, and saved history for drafting notes without opening a heavier writing app.",
    useCases: [
      "Drafting rough notes, outlines, messages, or reminders by voice.",
      "Reviewing dictated text, making edits, and listening back for flow.",
      "Keeping short local transcript history for follow-up work.",
    ],
    workflowSteps: [
      "Start a new dictation session when the note, outline, or message is ready to speak.",
      "Review the transcript, clean up wording, and use playback when the phrasing needs a second pass.",
      "Copy or revisit recent local history when the note is ready to move into another app.",
    ],
    faqs: [
      {
        question: "Is Dictate useful for rough drafts?",
        answer:
          "Yes. It is best for fast first-pass notes, outlines, reminders, and messages that can be edited before they become final copy.",
      },
      {
        question: "Does Dictate replace a full writing app?",
        answer:
          "No. It is a lightweight capture workspace for turning speech into editable text before moving the result into a document, task manager, or message.",
      },
    ],
  },
  "dns-checker": {
    heading: "Check DNS propagation from more than one resolver.",
    summary:
      "DNS Checker queries public resolvers in parallel so domain changes can be compared across record types, response values, and lookup timing.",
    useCases: [
      "Verifying A, AAAA, MX, TXT, CNAME, or NS records after a DNS change.",
      "Comparing resolver responses when a domain works in one place but not another.",
      "Spotting propagation gaps before debugging hosting, email, or verification issues.",
    ],
    workflowSteps: [
      "Enter the domain and choose the DNS record type that matches the launch or verification task.",
      "Compare resolver responses, values, timing, and empty results side by side.",
      "Use mismatches to decide whether to wait for propagation or investigate the hosting, email, or DNS provider setup.",
    ],
    faqs: [
      {
        question: "Which DNS records can I check?",
        answer:
          "DNS Checker is designed for common launch and verification records including A, AAAA, MX, TXT, CNAME, and NS records.",
      },
      {
        question: "Why do different resolvers show different answers?",
        answer:
          "Resolver caches can update at different times. Comparing them helps separate normal propagation delay from a real configuration issue.",
      },
    ],
  },
  "font-converter": {
    heading: "Turn font files into practical web and desktop formats.",
    summary:
      "Font Converter batches font uploads, processes supported formats, and produces ready-to-download outputs for front-end builds, design handoff, or asset cleanup.",
    useCases: [
      "Preparing font assets for web projects that need browser-friendly formats.",
      "Converting several font files at once instead of running one-off exports.",
      "Organizing delivered typography assets before adding them to a project.",
    ],
    workflowSteps: [
      "Upload the font files that need to be prepared for the target project.",
      "Choose the output format needed for the web build, desktop handoff, or asset archive.",
      "Download the converted files and keep the batch together for implementation or delivery.",
    ],
    faqs: [
      {
        question: "When should I convert font files?",
        answer:
          "Convert fonts when a project needs a browser-friendly format, a desktop-compatible handoff, or a cleaned-up set of typography assets.",
      },
      {
        question: "Can Font Converter handle batches?",
        answer:
          "Yes. It is built for batch uploads so several font files can move through the same conversion workflow together.",
      },
    ],
  },
  "heatmap-tracker": {
    heading: "Prototype heatmap ideas before adding analytics infrastructure.",
    summary:
      "Heatmap Tracker lets you place and export local click hotspots on a screenshot, making it useful for demos, design reviews, and early analytics planning.",
    useCases: [
      "Mocking up how click activity could look on a page or product screen.",
      "Annotating a screenshot with interaction hotspots during UX review.",
      "Exporting local heatmap point data for a prototype or proof of concept.",
    ],
    workflowSteps: [
      "Upload or prepare the screen that needs an interaction heatmap concept.",
      "Place hotspot points where clicks, taps, or attention should be represented.",
      "Export the heatmap view or point data for a review, prototype, or planning note.",
    ],
    faqs: [
      {
        question: "Is Heatmap Tracker a production analytics tool?",
        answer:
          "No. It is a local prototyping tool for mockups, demos, UX reviews, and early analytics planning before adding real tracking infrastructure.",
      },
      {
        question: "What should I use it with?",
        answer:
          "Use it with screenshots, product screens, landing page comps, or prototype states where a visual click pattern would clarify the discussion.",
      },
    ],
  },
  "image-compressor": {
    heading: "Compress images and decrease resolution before upload.",
    summary:
      "Image Compressor processes image batches in the browser, lowers file size, can decrease image resolution with max width and height controls, and exports files or a ZIP.",
    useCases: [
      "Reducing large images before publishing them to a website, CMS, or product page.",
      "Decreasing picture size or resolution while preserving the original aspect ratio.",
      "Compressing a batch of screenshots, product images, or content assets together.",
    ],
    workflowSteps: [
      "Drop in the images that are too heavy for the page, CMS, or handoff.",
      "Set quality plus max width and height when the image should be resized down.",
      "Review compression results, resolution changes, and file-size savings before downloading.",
      "Export individual files or a ZIP when the optimized batch is ready.",
    ],
    faqs: [
      {
        question: "Can I decrease image resolution with this compressor?",
        answer:
          "Yes. Set a max width and max height to resize large images down while keeping the aspect ratio intact.",
      },
      {
        question: "When should I compress images?",
        answer:
          "Compress images before publishing, uploading to a CMS, sending a handoff, or adding large screenshots to a page where file weight and picture size matter.",
      },
      {
        question: "Can I condense more than one image at once?",
        answer:
          "Yes. Image Compressor supports batch workflows and ZIP export so related assets can be condensed and downloaded together.",
      },
    ],
  },
  "image-converter": {
    heading: "Convert image formats without leaving the browser.",
    summary:
      "Image Converter changes images into JPG, PNG, WebP, or PDF outputs with batch controls, file previews, and downloadable results.",
    useCases: [
      "Preparing images for a platform that requires a specific file type.",
      "Converting several design, screenshot, or content assets in one pass.",
      "Creating PDFs from image files for sharing, archiving, or quick review.",
    ],
    workflowSteps: [
      "Add one image or a batch of files that need a different output format.",
      "Pick the target format, then preview the conversion results before export.",
      "Download individual outputs or use batch export when several files are ready.",
    ],
    faqs: [
      {
        question: "Which image formats can I convert to?",
        answer:
          "Image Converter is built around common practical outputs including JPG, PNG, WebP, and PDF.",
      },
      {
        question: "Why convert images in the browser?",
        answer:
          "Browser conversion is useful for quick platform requirements, content cleanup, and batch handoffs without opening a heavier design app.",
      },
    ],
  },
  "image-extractor": {
    heading: "Extract image assets from a webpage.",
    summary:
      "Image Extractor scans a webpage URL for discoverable image URLs and assets, groups useful results, and supports single-file or ZIP downloads.",
    useCases: [
      "Reviewing page imagery during content, migration, or redesign work.",
      "Finding source image URLs without manually inspecting page markup.",
      "Collecting visible page assets for local analysis or cleanup.",
    ],
    workflowSteps: [
      "Enter the webpage URL that needs an image inventory.",
      "Review discovered image URLs, visible assets, and grouped results for useful files.",
      "Download individual images or export a ZIP when the asset set is ready.",
    ],
    faqs: [
      {
        question: "When is Image Extractor useful?",
        answer:
          "It is useful during redesigns, migrations, content audits, and cleanup passes when image assets need to be found from a live page.",
      },
      {
        question: "Does Image Extractor replace source files?",
        answer:
          "No. It helps recover and inspect discoverable page assets when source files are missing or scattered.",
      },
    ],
  },
  "image-to-text": {
    heading: "Convert image text to text you can copy.",
    summary:
      "Image to Text runs OCR locally in the browser to extract words from screenshots, scans, labels, and image-based documents, then gives you copy and download controls.",
    useCases: [
      "Pulling text from screenshots, scanned notes, labels, photos, or image-based documents.",
      "Turning image text into editable text for notes, content cleanup, or data entry.",
      "Checking OCR confidence before reusing the extracted result.",
    ],
    workflowSteps: [
      "Upload the screenshot, scan, label, note, or image-based document.",
      "Run OCR and review the image-to-text result alongside confidence details.",
      "Copy or download the cleaned result once the text is ready to reuse.",
    ],
    faqs: [
      {
        question: "Can this convert image text to text I can copy?",
        answer:
          "Yes. Upload an image with readable text, run OCR in the browser, then copy or download the extracted text.",
      },
      {
        question: "What kinds of images work best for OCR?",
        answer:
          "Clear screenshots, scans, labels, and high-contrast text images usually produce better results than blurry, skewed, or heavily stylized text.",
      },
      {
        question: "Why check OCR confidence?",
        answer:
          "Confidence helps flag areas that may need manual review before the extracted text is reused in content, documentation, or data entry.",
      },
    ],
  },
  "lorem-ipsum-generator": {
    heading: "Generate placeholder copy at the size you actually need.",
    summary:
      "Lorem Ipsum Generator creates filler text by paragraph, sentence, or word count so mockups and content slots can be tested quickly.",
    useCases: [
      "Filling design comps, wireframes, and prototypes with realistic text volume.",
      "Testing layout behavior for short blurbs, long paragraphs, or repeated sections.",
      "Copying placeholder text without opening a separate document or generator site.",
    ],
    workflowSteps: [
      "Choose whether the layout needs words, sentences, or paragraphs.",
      "Set the amount of placeholder copy needed for the content slot.",
      "Copy the generated text into the mockup, prototype, CMS field, or test layout.",
    ],
    faqs: [
      {
        question: "Why use generated placeholder text?",
        answer:
          "Placeholder text helps test layout rhythm, wrapping, spacing, and empty content states before final copy is ready.",
      },
      {
        question: "Can I control the amount of text?",
        answer:
          "Yes. Lorem Ipsum Generator can create text by word, sentence, or paragraph count so the output fits the exact slot.",
      },
    ],
  },
  "modular-wireframe-generator": {
    heading: "Assemble page structure before polishing the visual design.",
    summary:
      "Modular Wireframe Generator combines common website sections, variation controls, and export options for fast planning of page layouts.",
    useCases: [
      "Exploring landing page, pricing, feature, gallery, contact, or testimonial structures.",
      "Comparing section variations before committing to a full design pass.",
      "Exporting a rough layout for discussion, documentation, or next-step design work.",
    ],
    workflowSteps: [
      "Add the page sections that match the structure you need to explore.",
      "Cycle variations until the rough hierarchy, rhythm, and order make sense.",
      "Export the wireframe for feedback, documentation, or the next design pass.",
    ],
    faqs: [
      {
        question: "What kinds of pages can I wireframe?",
        answer:
          "The tool is useful for landing pages, pricing pages, feature sections, galleries, contact layouts, testimonials, and other common website structures.",
      },
      {
        question: "Is this meant for polished visual design?",
        answer:
          "No. It is for fast structure planning before visual polish, copy refinement, and detailed component design.",
      },
    ],
  },
  "proportion-scaler": {
    heading: "Resize dimensions while keeping the ratio intact.",
    summary:
      "Proportion Scaler calculates proportional width and height values from an original size, making aspect-ratio math quick and copyable.",
    useCases: [
      "Resizing images, embeds, canvases, videos, or design frames without distortion.",
      "Finding a matching dimension when only one side is known.",
      "Checking common ratios before exporting or implementing fixed-format assets.",
    ],
    workflowSteps: [
      "Enter the original width and height to define the starting ratio.",
      "Change one target dimension and let the matching side update automatically.",
      "Copy the proportional dimensions into the export dialog, CSS, embed, or design frame.",
    ],
    faqs: [
      {
        question: "What is Proportion Scaler best for?",
        answer:
          "It is best for resizing images, videos, canvases, embeds, thumbnails, and design frames while preserving the original aspect ratio.",
      },
      {
        question: "Why preserve aspect ratio?",
        answer:
          "Preserving aspect ratio prevents stretching and keeps fixed-format assets looking correct across exports, embeds, and responsive layouts.",
      },
    ],
  },
  "redirect-analyzer": {
    heading: "Map where a URL really redirects.",
    summary:
      "Redirect Analyzer is a redirect mapping tool that follows a URL through status codes, hops, final destinations, and protocol changes so redirect behavior is easier to debug.",
    useCases: [
      "Checking whether a campaign, affiliate, or migrated URL lands in the right place.",
      "Finding extra redirect hops with a redirect chain checker before they slow down a page or obscure the final URL.",
      "Confirming HTTP-to-HTTPS upgrades and status codes during SEO cleanup.",
    ],
    workflowSteps: [
      "Paste the URL that needs to be checked before launch, migration, or campaign use.",
      "Review each redirect hop, status code, protocol change, and final destination.",
      "Use the chain to remove unnecessary hops or confirm that the final URL is correct.",
    ],
    faqs: [
      {
        question: "Why audit redirect chains?",
        answer:
          "Redirect chains can slow pages, hide final destinations, break tracking, or preserve old migration mistakes. Mapping the hops makes those issues easier to fix.",
      },
      {
        question: "What should a clean redirect look like?",
        answer:
          "A clean redirect usually reaches the intended HTTPS destination with as few hops as possible and with a status code that matches the purpose of the redirect.",
      },
    ],
  },
  "sitemap-robots-explorer": {
    heading: "Map crawl hints from robots.txt and sitemap files.",
    summary:
      "Sitemap Robots Explorer reads a site entry point, discovers sitemap references, scans URLs, and groups discovered paths into useful categories.",
    useCases: [
      "Getting a fast view of a website's public URL structure.",
      "Checking whether robots.txt exposes expected sitemap locations.",
      "Categorizing discovered URLs before a content audit, migration, or technical SEO review.",
    ],
    workflowSteps: [
      "Enter the site URL or robots.txt entry point for the crawl hint review.",
      "Review sitemap references, discovered URLs, and grouped path categories.",
      "Use the output to plan a content audit, migration check, or technical SEO pass.",
    ],
    faqs: [
      {
        question: "What does Sitemap Robots Explorer look for?",
        answer:
          "It looks for robots.txt rules, sitemap references, discovered sitemap URLs, and path groups that help explain the public crawl surface of a site.",
      },
      {
        question: "When should I run a sitemap and robots check?",
        answer:
          "Run it before audits, launches, migrations, and cleanup work so crawl hints and public URL coverage are visible early.",
      },
    ],
  },
  vectorvault: {
    heading: "Manage SVG icons from a lightweight local library.",
    summary:
      "Vector Vault provides search, preview, editing, upload, and export flows for SVG icons without turning icon cleanup into a larger asset-management task.",
    useCases: [
      "Finding and copying reusable SVG icons during interface design or development.",
      "Editing icon details before export or handoff.",
      "Keeping a practical local icon library for repeated project work.",
    ],
    workflowSteps: [
      "Search or upload icons that belong in the local SVG library.",
      "Preview, edit, and organize the icon before copying or exporting it.",
      "Reuse the cleaned SVG in interface work, design handoff, or project documentation.",
    ],
    faqs: [
      {
        question: "What is Vector Vault for?",
        answer:
          "Vector Vault is for keeping a lightweight local SVG library searchable, editable, and ready for repeated design and development work.",
      },
      {
        question: "Can I edit icons before export?",
        answer:
          "Yes. The workflow supports previewing, editing, uploading, and exporting SVG icons so cleanup can happen before handoff.",
      },
    ],
  },
};
