export interface Link {
  name: string;
  url: string;
  description: string;
}

export interface Subcategory {
  name: string;
  links: Link[];
}

export interface LinkCategory {
  name: string;
  links?: Link[];
  subcategories?: Subcategory[];
}

export const linkCategories: LinkCategory[] = [
  {
    name: "Programming Languages",
    links: [
      {
        name: "Elixir",
        url: "https://elixir-lang.org/",
        description:
          "The best programming language for creating web APIs, bar none. Builds on top of Erlang, which solved the problem of concurrency and distributed systems all the way back in the 80s",
      },
    ],
  },
  {
    name: "Programming Editors",
    links: [
      {
        name: "Zed",
        url: "https://zed.dev/",
        description:
          "A high-performance text editor written in Rust that's a great alternative to Electron slop like VSCode and its forks",
      },
      {
        name: "Neovim",
        url: "https://neovim.io/",
        description: "The One True Text Editor",
      },
      {
        name: "kickstart.nvim",
        url: "https://github.com/nvim-lua/kickstart.nvim",
        description:
          "A starting point for your Neovim configuration. While Neovim is powerful, initial setup can be challenging. kickstart.nvim provides a solid foundation, offering more than just basic functionality to help you get started quickly",
      },
    ],
  },
  {
    name: "Web Development",
    links: [
      {
        name: "htmx.org",
        url: "https://htmx.org/",
        description:
          "High power tools for HTML. Also has a bunch of essays related to web development",
      },
      {
        name: "Building a website like it's 1999... in 2022",
        url: "https://localghost.dev/blog/building-a-website-like-it-s-1999-in-2022/",
        description: "The web used to be so interesting",
      },
    ],
  },

  {
    name: "Tech Commentary",
    links: [
      {
        name: "These Modern Programming Languages Will Make You Suffer",
        url: "https://freedium.cfd/https://betterprogramming.pub/modern-languages-suck-ad21cbc8a57c",
        description:
          "While I don't agree with all the points in this article, the overall message is good: Choose your programming language carefully!",
      },
      {
        name: "Object-Oriented Programming — The Trillion Dollar Disaster",
        url: "https://freedium.cfd/https://betterprogramming.pub/object-oriented-programming-the-trillion-dollar-disaster-92a4b666c7c7",
        description: "OOP? More like OOPs, you broke global state again!",
      },
      {
        name: "The 'Enshittification' of TikTok",
        url: "https://www.wired.com/story/tiktok-platforms-cory-doctorow/",
        description:
          '"Here is how platforms die: First, they are good to their users; then they abuse their users to make things better for their business customers; finally, they abuse those business customers to claw back all the value for themselves. Then, they die."',
      },
    ],
  },
  {
    name: "Operating Systems",
    links: [
      {
        name: "NixOS",
        url: "https://nixos.org/",
        description:
          "Declarative Linux distribution with reproducible builds, built around the Nix package manager",
      },
      {
        name: "GNU Guix",
        url: "https://guix.gnu.org/",
        description:
          "Declarative Linux distribution with reproducible builds, built around the Guix package manager",
      },
    ],
  },
  {
    name: "AI & Machine Learning",
    links: [
      {
        name: "Hugging Face",
        url: "https://huggingface.co/",
        description: "Like a Git Forge but for machine learning",
      },
      {
        name: "Nous Research",
        url: "https://nousresearch.com/",
        description: "Open source AI research and development with an awesome design style",
      },
      {
        name: "Ollama",
        url: "https://ollama.ai/",
        description: "Run large language models locally",
      },
      {
        name: "vLLM",
        url: "https://vllm.ai/",
        description:
          "High-throughput and memory-efficient inference engine for large language models",
      },
    ],
    subcategories: [
      {
        name: "Nx (Elixir)",
        links: [
          {
            name: "Livebook",
            url: "https://livebook.dev/",
            description: "Interactive and collaborative code notebooks for Elixir",
          },
          {
            name: "Nx",
            url: "https://github.com/elixir-nx/nx",
            description: "Multi-dimensional arrays (tensors) and numerical definitions for Elixir",
          },
          {
            name: "Axon",
            url: "https://github.com/elixir-nx/axon",
            description: "Nx-powered Neural Networks for Elixir",
          },
          {
            name: "Bumblebee",
            url: "https://github.com/elixir-nx/bumblebee",
            description: "GPT2, Stable Diffusion, and other pre-trained models in Axon",
          },
          {
            name: "Scholar",
            url: "https://github.com/elixir-nx/scholar",
            description: "Traditional machine learning tools built on top of Nx",
          },
          {
            name: "Explorer",
            url: "https://github.com/elixir-nx/explorer",
            description: "Dataframes for Elixir",
          },
        ],
      },
    ],
  },
  {
    name: "Privacy & Security",
    links: [
      {
        name: "Mozilla's 'Privacy Not Included'",
        url: "https://foundation.mozilla.org/en/privacynotincluded/",
        description:
          "Product reviews in regards to privacy. Did you know that [employees of Amazon Ring were caught spying on female customers?](https://www.malwarebytes.com/blog/news/2023/06/amazons-ring-camera-used-to-spy-on-customers)",
      },
      {
        name: "Monero",
        url: "https://www.getmonero.org/",
        description: "Private, decentralized cryptocurrency",
      },
    ],
  },
  {
    name: "Development & Learning",
    subcategories: [
      {
        name: "Learning Platforms",
        links: [
          {
            name: "Exercism",
            url: "https://exercism.org",
            description: "Code practice and mentorship for everyone",
          },
        ],
      },
    ],
  },
  {
    name: "Tools & Productivity",
    links: [
      {
        name: "Obsidian",
        url: "https://obsidian.md/",
        description: "Knowledge management with linked notes",
      },
    ],
  },
  {
    name: "Science & Research",
    subcategories: [
      {
        name: "Publications",
        links: [
          {
            name: "arXiv",
            url: "https://arxiv.org/",
            description: "Preprint repository for research papers",
          },
        ],
      },
    ],
  },
  {
    name: "Miscellaneous",
    links: [
      {
        name: "five.sh",
        url: "https://five.sh/",
        description: "Cool website",
      },
      {
        name: "Internet Archive",
        url: "https://archive.org/",
        description: "Digital library preserving internet history",
      },
    ],
  },
];
