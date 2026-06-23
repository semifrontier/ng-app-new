export type BlogVisualKind =
  | "seo"
  | "workflow"
  | "images"
  | "writing"
  | "design"
  | "links"
  | "dns";

export type BlogAccent = "blue" | "yellow" | "red";

export type BlogImage = {
  src: string;
  alt: string;
  credit: string;
  caption?: string;
};

export type BlogArticleSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  image?: BlogImage;
};

export type BlogArticle = {
  author: string;
  publishedDate: string;
  modifiedDate: string;
  heroImage: BlogImage;
  sections: BlogArticleSection[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  visual: BlogVisualKind;
  accent: BlogAccent;
  related: {
    label: string;
    to: string;
  };
  article?: BlogArticle;
};

export type PublishedBlogPost = BlogPost & {
  article: BlogArticle;
};

const AI_GRAPHIC_DESIGN_IMAGES = {
  hero: {
    src: "/blog/ai-in-graphic-design/hero.webp",
    alt: "Designer sketching interface ideas on a tablet beside a desktop monitor.",
    credit: "Photo by Mahmudul Hasan on Unsplash",
  },
  wireframe: {
    src: "/blog/ai-in-graphic-design/wireframe.webp",
    alt: "Hands drawing a website wireframe on paper.",
    credit: "Photo by Juno Jo on Unsplash",
    caption:
      "AI can help with early structure, but a designer still has to decide what the work should communicate.",
  },
  humanTouch: {
    src: "/blog/ai-in-graphic-design/human-touch.webp",
    alt: "Close-up portrait lit with dramatic shadow.",
    credit: "Photo by Korie Cull on Unsplash",
    caption:
      "The human touch shows up in judgment, taste, restraint, and knowing when not to generate more.",
  },
  designerScreen: {
    src: "/blog/ai-in-graphic-design/designer-screen.webp",
    alt: "Designer reviewing mobile interface mockups on a desktop screen.",
    credit: "Photo by Nubelson Fernandes on Unsplash",
    caption:
      "Designers who learn where AI fits can move faster without giving up ownership of the final result.",
  },
  studio: {
    src: "/blog/ai-in-graphic-design/studio.webp",
    alt: "Creative studio desk with laptop, monitor, plants, and sketch paper.",
    credit: "Photo by Olena Bohovyk on Unsplash",
  },
} satisfies Record<string, BlogImage>;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ai-in-graphic-design-keeping-the-human-touch",
    title: "AI in Graphic Design: Keeping the Human Touch",
    excerpt:
      "AI can speed up creative work, but designers still need to own the judgment, typography, brand meaning, and human touch that make design valuable.",
    category: "Design",
    date: "Jun 23, 2026",
    readTime: "9 min read",
    visual: "design",
    accent: "blue",
    related: {
      label: "Read article",
      to: "/blog/ai-in-graphic-design-keeping-the-human-touch",
    },
    article: {
      author: "No Gatekeeping",
      publishedDate: "2026-06-23",
      modifiedDate: "2026-06-23",
      heroImage: AI_GRAPHIC_DESIGN_IMAGES.hero,
      sections: [
        {
          id: "why-ai-is-everywhere",
          heading: "Why AI in Graphic Design Is Everywhere Right Now",
          paragraphs: [
            "When you look at why AI in graphic design is everywhere right now, a lot of it comes down to money. There has been a huge amount of development money poured into AI tools, and now there is just as much marketing money behind them. These companies have already invested heavily, so they are looking for places to apply the tech, and graphic design is an obvious one. When you see the valuations around companies like OpenAI or the push Google is making with Gemini, it is not hard to understand why image generators and creative tools are getting so much attention. It is one more industry they can move into using tools they have already built.",
            "That also explains why AI is being pushed so hard, even though the technology is not really there yet in terms of originality or quality. Most AI-generated design still looks like AI. I honestly have not seen a flyer, an ad, or a piece of design work made entirely with AI that I could not spot almost immediately. That has not stopped these tools from being marketed, though, especially because they make design feel more accessible. People who do not consider themselves artistic, do not know Illustrator, or do not want to learn Canva can suddenly create something just by writing a prompt. It is basically vibe coding, but applied to graphic design.",
            "The bigger shift, though, is coming from the business side. Business owners and people who hire designers are looking at AI and thinking they can skip the designer altogether. Whether it is a full-time role, freelance work, or a one-off project, AI feels like a way to cut costs. Saving money is obviously appealing, especially if it frees up budget for other parts of the business that feel more urgent. The problem, which we will get into later, is that the quality of what is being produced often turns into what people call AI slop, and that can quietly devalue a brand and create inconsistencies across its visual identity.",
          ],
          image: AI_GRAPHIC_DESIGN_IMAGES.wireframe,
        },
        {
          id: "what-designers-fear-losing",
          heading: "What Designers Are Actually Afraid of Losing",
          paragraphs: [
            "When designers talk about AI replacing graphic designers, the fear is pretty simple. They are afraid of losing their jobs. Most designers go to school for graphic design. They spend years learning tools like Illustrator and Photoshop, building resumes full of client work, and creating portfolios that prove their experience and skill. That entire path starts to feel threatened when AI enters the conversation, because AI does not need a portfolio. It just needs a good prompt.",
            "There is also the speed factor. AI can generate a flyer or a graphic in 30 seconds, while a designer might spend an hour or two, or more, on the same piece. Even if the designer's work is objectively better, higher quality, and more thoughtful, there is a real concern that companies will decide the time savings and cost savings matter more than the end result. As a designer, that is scary. If speed and price become the only things that matter, quality stops being the deciding factor.",
            "That is where the fear starts to go deeper than just losing a single job. If AI takes over a lot of design work, graphic design starts to look less like a stable career and more like being an artist. Artists can make incredible work, but making a consistent living depends on selling pieces, and that is notoriously hard to break into. Graphic design, on the other hand, has always had practical, steady demand. Most companies need designers. If those roles disappear, then graphic design stops feeling like a viable long-term career, and it takes away one of the few ways people get to do creative work as part of their everyday jobs.",
            "There is also another fear, one that is maybe a bit more altruistic, but still very real. Designers worry about losing individuality and personality in design itself. AI is trained on existing work, and over time it is also trained on its own output and feedback. If design shifts too far in that direction, how long does it take before everything starts to look the same? Designers specialize in different things. Some focus on illustration, some on motion, some on typography, some on vector art. That variety is part of what makes design interesting. If AI takes over, there is a concern that all of that gets flattened into one dominant style, or one general vibe with only minor differences. Losing that creative diversity is genuinely scary, not just for designers, but for culture as a whole.",
          ],
          image: AI_GRAPHIC_DESIGN_IMAGES.humanTouch,
        },
        {
          id: "ai-as-a-partner",
          heading: "AI as a Partner, Not a Replacement",
          paragraphs: [
            "When I say AI should be a partner, not a replacement for designers, I mean using it in very specific, practical ways that support the work instead of taking it over. A simple example is image formatting. Let us say a client gives you a vertical image, but the flyer or layout you are designing needs a horizontal image. In the past, that might mean sourcing a new photo or zooming in so much that you lose important details. Now, you can bring that image into Photoshop and use generative fill or image expansion to turn a vertical image into a landscape one. You are keeping the original image and just extending the edges so it fits the design.",
            "Another example is textures. Maybe you need a concrete texture for a background, but none of your usual sources quite match what you are looking for. Instead of settling, you can use AI tools to generate a texture that fits your vision more closely. You are not asking AI to design the flyer for you, just to help create a specific asset that you can then use intentionally within your design.",
            "AI can also work as a feedback partner. You can export a flyer as a PDF, upload it, and ask for feedback. At the very least, it can spell check with extreme accuracy, which matters more than people realize. Beyond that, it can point out inconsistencies, readability issues, or flow problems, and suggest simple changes like rearranging sections. You still make the final decisions, but you are getting another set of eyes on the work.",
            "Even when it comes to layout and ideation, AI can be useful without replacing the designer. Using AI-generated wireframes or layout variations can help you quickly decide where elements should live, especially when time is tight. That allows you to skip some of the early structural decision-making and jump straight into refining the design and making it look good.",
            "Ultimately, while AI is not at a point where it can replace designers in most real-world scenarios, it can absolutely improve the design process. It can speed things up, help with ideation, and make up for weaknesses. I am not a strong copywriter, for example, but with the right prompts and enough context, AI can handle a lot of that for me. That lets me focus more on my strengths instead of being held back by a weaker skill. Personally, I think avoiding AI altogether is a missed opportunity. Used intentionally, it creates more value for designers, not less.",
          ],
        },
        {
          id: "what-ai-should-never-replace",
          heading: "What AI Should Never Replace in Graphic Design",
          paragraphs: [
            "When I think about what AI should never replace in graphic design, the first thing that comes to mind is typography and font design. There is something deeply human about it. Even before the printing press, there was something almost magical about people who could take words and turn them into art just through how they were written. That human quality still exists today in type design.",
            "You see it in modern type foundries, where designers create unique, beautiful typefaces that can be used in all kinds of ways. Even if AI eventually becomes capable of generating fonts or full type families, that does not replace the value of human-made typography. Given the history of art and graphic design, that human touch is something that should not be fully removed from the process.",
            "Logo creation is another major boundary. Great logo design involves digging into a brand's history, personality, and values, then translating those abstract qualities into something visual. It is a thoughtful, intentional process. Even if AI becomes capable of generating logos, there should always be a designer involved. Someone who understands how to create meaning, not just visuals.",
            "Branding also requires consistency and responsiveness. Logos need to work in many formats, from large-scale applications down to tiny icons, without losing their identity. That cohesion comes from experience and judgment, not just generation. Even as AI improves, branding and logo design are areas where human decision-making should remain central.",
          ],
          image: AI_GRAPHIC_DESIGN_IMAGES.designerScreen,
        },
        {
          id: "where-creativity-is-heading",
          heading: "Where AI and Human Creativity Are Heading Together",
          paragraphs: [
            "Creative work has always evolved alongside tools. There was a time when writing everything by hand added friction to the process, not because it was more thoughtful, but because it was slower. Typing did not remove creativity, it removed unnecessary barriers. The same thing happened in animation, where early work required everything to be drawn frame by frame. Digital tools did not remove artists from the process, they changed how the work got done.",
            "Graphic design has followed that same path, moving from hand-crafted work to software, and now toward AI-assisted workflows. AI does not replace the designer, it removes friction. It speeds up certain tasks and helps cover gaps that used to slow things down.",
            "I think we are heading toward a point where people will look back and wonder how graphic designers worked without AI tools. How long things used to take. How much time was spent on tasks that did not really require human creativity. Designers will increasingly be valued not just for execution, but for judgment. Knowing how to guide AI, integrate it into workflows, and decide when not to use it will become part of the job.",
            "The designers who thrive will not be the ones who resist AI completely. They will be the ones who understand how to use it to amplify what they already do well.",
          ],
          image: AI_GRAPHIC_DESIGN_IMAGES.studio,
        },
        {
          id: "line-designers-need-to-draw",
          heading: "The Line Designers Need to Draw",
          paragraphs: [
            "What designers actually lose by refusing to engage with AI is not philosophical. It is practical. They risk losing jobs, not because AI replaces them, but because other designers become better at using AI as part of their process. That is the irony. Designers will not lose work to AI, they will lose work to other designers who know how to use AI effectively.",
            "As AI becomes more capable, responsibility does not shift away from designers. It shifts onto them. AI replaces parts of the process, not the role itself. It speeds up tasks that used to take longer, but the decisions still come from the designer. Creativity, judgment, and intent remain human responsibilities.",
            "If there is one clear line to draw, it is this: AI is part of the process, it is not the whole process. Designers should not prompt AI, export whatever it generates, and send it to a client. That is lazy and irresponsible, and it removes any real value from the role. Clients can already do that themselves.",
            "What sets designers apart is their ability to create something thoughtful, consistent, and aligned with a brand. AI should be used to improve that process, not replace it. Used intentionally, it makes designers faster and more effective. Used carelessly, it strips away the very thing that makes design meaningful in the first place.",
          ],
        },
      ],
    },
  },
  {
    slug: "browser-tools-workflow",
    title: "How to turn one-off browser utilities into a repeatable workflow",
    excerpt:
      "A lightweight way to chain conversion, cleanup, extraction, and QA tools without forcing every task through a heavyweight app.",
    category: "Product",
    date: "Jun 18, 2026",
    readTime: "5 min read",
    visual: "workflow",
    accent: "yellow",
    related: {
      label: "Browse tools",
      to: "/tools",
    },
  },
  {
    slug: "clean-image-handoffs",
    title: "Clean image handoffs: compress, convert, extract, repeat",
    excerpt:
      "A practical image workflow for when files need to move from messy downloads to usable assets without a round trip through a design suite.",
    category: "Images",
    date: "Jun 14, 2026",
    readTime: "4 min read",
    visual: "images",
    accent: "red",
    related: {
      label: "Compress images",
      to: "/tools/image-compressor",
    },
  },
  {
    slug: "faster-writing-tools",
    title: "Writing faster without making every page feel generic",
    excerpt:
      "Small text tools are strongest when they remove formatting drag, preserve intent, and keep the writer in control of tone and structure.",
    category: "Text",
    date: "Jun 10, 2026",
    readTime: "4 min read",
    visual: "writing",
    accent: "blue",
    related: {
      label: "Convert case",
      to: "/tools/case-converter",
    },
  },
  {
    slug: "color-workflow",
    title: "Color work that moves from idea to export without tab chaos",
    excerpt:
      "Palette generation gets more useful when exploration, contrast checks, and export formats live close together.",
    category: "Design",
    date: "Jun 6, 2026",
    readTime: "5 min read",
    visual: "design",
    accent: "yellow",
    related: {
      label: "Build palettes",
      to: "/tools/color-palette-generator",
    },
  },
  {
    slug: "utm-links-that-age-well",
    title: "UTM links that marketing teams can actually audit later",
    excerpt:
      "The difference between campaign links that help and campaign links that become a spreadsheet archaeology project.",
    category: "URLs",
    date: "May 30, 2026",
    readTime: "3 min read",
    visual: "links",
    accent: "red",
    related: {
      label: "Build campaign URLs",
      to: "/tools/campaign-url-architect",
    },
  },
  {
    slug: "dns-redirect-preflight",
    title: "DNS and redirects: the quiet checks before a launch",
    excerpt:
      "Before a page goes live, the unglamorous checks often prevent the loudest launch-day problems.",
    category: "SEO Ops",
    date: "May 24, 2026",
    readTime: "4 min read",
    visual: "dns",
    accent: "blue",
    related: {
      label: "Check DNS",
      to: "/tools/dns-checker",
    },
  },
  {
    slug: "responsive-ratio-checks",
    title: "Ratio checks before publishing responsive graphics",
    excerpt:
      "A quick way to keep thumbnails, social crops, and product screenshots from drifting across breakpoints.",
    category: "Design",
    date: "May 18, 2026",
    readTime: "3 min read",
    visual: "design",
    accent: "yellow",
    related: {
      label: "Scale proportions",
      to: "/tools/proportion-scaler",
    },
  },
  {
    slug: "extracting-page-assets",
    title: "Pulling usable image assets from existing pages",
    excerpt:
      "When the source file is missing, a focused extraction pass can still turn a live page into a tidy asset handoff.",
    category: "Images",
    date: "May 12, 2026",
    readTime: "4 min read",
    visual: "images",
    accent: "red",
    related: {
      label: "Extract images",
      to: "/tools/image-extractor",
    },
  },
];

export const PUBLISHED_BLOG_POSTS = BLOG_POSTS.filter(
  (post): post is PublishedBlogPost => Boolean(post.article),
);

export function getBlogPostPath(post: Pick<BlogPost, "slug">) {
  return `/blog/${post.slug}`;
}

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
