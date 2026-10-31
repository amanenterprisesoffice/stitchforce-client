'use client';

import { Button } from "@/components/ui/button";
import FEATURES from "@/constants/features.json";
import TESTIMONIALS from "@/constants/testimonials.json";
import { ArrowRight, ArrowUpRight, AtomIcon, Box, Search } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Footer from "@/components/ui/Footer";
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { motion, useScroll, useTransform } from "framer-motion";

const jobCardsData = [
  {
    banner: "https://opportunitydesk.org/wp-content/uploads/2021/08/A-Quick-Look-At-the-Evolving-Software-Engineering-Job-Market.jpg",
    logo: "https://logo.clearbit.com/microsoft.com",
    company: "Microsoft",
    title: "Senior Frontend Engineer",
    location: "Remote",
    id: "Job #1"
  },
  {
    banner: "https://images.prismic.io/turing/ZlRn0yk0V36pXpvn_45400-BlogUpdates_01-104-79_Hero_1232-770.jpg?auto=format,compress",
    logo: "https://logo.clearbit.com/google.com",
    company: "Google",
    title: "Machine Learning Engineer",
    location: "Mountain View, CA",
    id: "Job #2"
  },
  {
    banner: "https://www.simplilearn.com/ice9/free_resources_article_thumb/cyber_security_vs_software_engineering.jpg",
    logo: "https://logo.clearbit.com/amazon.com",
    company: "Amazon",
    title: "Cloud Solutions Architect",
    location: "Seattle, WA",
    id: "Job #3"
  },
  {
    banner: "https://www.mygreatlearning.com/blog/wp-content/uploads/2022/03/software-engineer-job-skills-1.jpg",
    logo: "https://logo.clearbit.com/apple.com",
    company: "Apple",
    title: "iOS Developer Lead",
    location: "Cupertino, CA",
    id: "Job #4"
  },
  {
    banner: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/5pYWUQqkAecxZIriEO4McJ/4fee4a534df2ccd82d5c060997f471ab/Teamwork-in-construction-industry---two-engineers-working-together-on-construction-site-with-blueprints-and-plans-645373486.jpeg?w=1500&h=680&q=60&fit=fill&f=faces&fm=jpg&fl=progressive&auto=format%2Ccompress&dpr=1&w=1000",
    logo: "https://logo.clearbit.com/netflix.com",
    company: "Netflix",
    title: "Data Science Manager",
    location: "Los Gatos, CA",
    id: "Job #5"
  }
];



const images = [
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa4959_flowfi_logo.svg.webp",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa4908_unis-logo%201.webp",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa4481_deel-1%20logo.svg",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa4448_webflow_logo.svg.svg",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa44b2_image%20172.webp",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa493b_image%20203.webp",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa4946_c64a3fd7-26df-4d8d-9f19-53202d7ff53f%201%20(1).webp",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67eeaec88d46a6e3c8e945a3_Group%201413372541.svg",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa4496_Group.svg",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa4504_image%20174.webp",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa493f_image%20204.webp",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa4499_64ba5cf6913daccfa5434904_Logo%201.svg",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa447a_layer1.svg",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa44a4_Group%201413372395.svg",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa498f_logo-header%201.webp",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa4486_Group%201413372393.svg",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa4947_Clip%20path%20group.webp",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa44f2_image%20173.webp",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa493e_2c7730f5-ba35-40e5-8f99-1f47a4e42a05%201.webp",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa4945_Screenshot_2025-03-15_at_8.34.11_PM-removebg-preview%201.webp",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa450c_jump_450_media_logo.svg.webp",
  "https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e70f741502e57481aa4922_Frame%201538232111.webp"
];

const serviceImgs = [
  {
    heading: "Website Development",
    img: "https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_1.0/v1/attachments/generic_asset/asset/798403f5b92b1b5af997acc704a3d21c-1702465156477/website-development.png"
  },
  {
    heading: "Logo Design",
    img: "https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_1.0/v1/attachments/generic_asset/asset/798403f5b92b1b5af997acc704a3d21c-1702465156494/logo-design.png"
  },
  {
    heading: "SEO",
    img: "https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_1.0/v1/attachments/generic_asset/asset/798403f5b92b1b5af997acc704a3d21c-1702465156488/seo.png"
  },
  {
    heading: "Architecture Design",
    img: "https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_1.0/v1/attachments/generic_asset/asset/798403f5b92b1b5af997acc704a3d21c-1702465156473/architecture-design.png"
  },
  {
    heading: "Voice Over",
    img: "https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_1.0/v1/attachments/generic_asset/asset/798403f5b92b1b5af997acc704a3d21c-1702465156479/voice-over.png"
  },
  {
    heading: "Social Media Marketing",
    img: "https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_1.0/v1/attachments/generic_asset/asset/798403f5b92b1b5af997acc704a3d21c-1702465156476/social-media-marketing.png"
  },
  {
    heading: "UGC Video Ads",
    img: "https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_1.0/v1/attachments/generic_asset/asset/ece24f7f595e2dd44b26567705d1c600-1728279781879/UGC%20Video%20img.png"
  },
  {
    heading: "Software Development",
    img: "https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_1.0/v1/attachments/generic_asset/asset/798403f5b92b1b5af997acc704a3d21c-1702465156476/software-development.png"
  },
  {
    heading: "Data Science & AI",
    img: "https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_1.0/v1/attachments/generic_asset/asset/798403f5b92b1b5af997acc704a3d21c-1702465156495/data-science.png"
  },
  {
    heading: "Product Photography",
    img: "https://fiverr-res.cloudinary.com/q_auto,f_auto,w_188,dpr_1.0/v1/attachments/generic_asset/asset/798403f5b92b1b5af997acc704a3d21c-1702465156481/product-photography.png"
  }
]


const Home = () => {
  const sectionRef = useRef(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const duplicatedImages = [...images, ...images];

  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);



  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'));
          setActiveIndex(index);
        }
      });
    }, options);

    imgRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });


    return () => {
      if (imgRefs.current) {
        imgRefs.current.forEach((el) => {
          if (el) observer.unobserve(el);
        });
      }
    };
  }, []);

  return (
    <div className=" overflow-hidden bg-background text-foreground ">
      <div ref={containerRef} className="h-screen overflow-auto ">
        <div className="flex flex-col my-container mx-auto  ">
          {/* Hero Section */}
          <section className="pt-44 pb-16 text-center bg-background">
            <div className="container mx-auto px-0 flex flex-col items-center">
              <Badge variant="outline">
                ✨ Check Out Our Newest Feature
                <ArrowUpRight className="ml-2 size-4" />
              </Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold max-w-4xl leading-tight mt-2 mb-6">
                Simplify your 3D workflow with visualization at <span className="text-primary">Portrix</span>
              </h1>
              <p className="text-base  text-muted-text max-w-2xl mb-8">
                Upload, preview, and fine-tune your GLB models — animations, lighting, transforms, and more — all in the browser. No installs. Just instant visual feedback.
              </p>

            </div>
          </section>

          {/* <SectionCards /> */}


          <section
            className="overflow-hidden border-y w-full py-10"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%, black 80%, transparent)',
              maskImage: 'linear-gradient(to right, transparent, black 30%, black 80%, transparent)'
            }}
          >
            <motion.div
              className="flex gap-12 items-center w-max"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                duration: 40,
                ease: 'linear',
                repeat: Infinity,
              }}
            >
              {duplicatedImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Carousel ${idx}`}
                  className={`w-25 h-10 object-contain brightness-[11] contrast-0`}
                />
              ))}
            </motion.div>
          </section>


          <section className=" py-50  ">
            <div className="container  max-w-xl font-medium text-3xl mx-auto ">
              Identify world-class talent that wouldn&apos;t typically be visible through legacy recruitment methods
            </div>
          </section>

          <section className="bg-secondary-foreground text-background ">
            <div className="container relative max-w-[70rem] mx-auto flex flex-col gap-28 ">
              <svg className="absolute top-0 right-[26%] z-0 h-screen" width="100%" height="100%" viewBox="0 0 525 778" fill="none" xmlns="http://www.w3.org/2000/svg">

                <path className="wo_line" opacity="0.5" d="M449.298 -65.7998C444.673 -65.3151 442.83 162.818 440.583 168.942C437.371 177.692 430.989 186.914 430.344 196.104C429.809 203.721 425.678 212.538 425.678 220.55C425.678 224.426 423.407 228.435 422.243 231.85C420.687 236.416 419.771 241.672 418.744 246.409C417.764 250.926 415.503 256.623 413.106 260.642C408.031 269.151 405.059 278.604 399.432 286.99C390.552 300.224 378.694 312.305 365.928 323.007C340.693 344.161 316.749 364.58 286.996 381.57C263.106 395.211 237.419 405.444 208.712 408.786C200.668 409.723 190.477 411.476 183.049 408.08C177.486 405.536 176.252 397.517 175.143 392.869C173.9 387.658 174.884 381.449 174.884 376.191C174.884 369.339 180.192 364.572 184.864 359.351C189.994 353.617 197.818 350.288 204.824 346.53C214.074 341.567 222.837 337.463 233.273 334.47C247.081 330.51 260.642 328.114 275.201 328.114C287.432 328.114 297.881 326.863 308.317 332.949C336.107 349.155 341.848 375.072 322.444 398.845C310.223 413.818 287.351 422.342 266.777 425.899C241.486 430.27 217.105 432.857 191.15 431.711C171.165 430.83 151.122 425.869 135.483 415.142C120.142 404.621 113.305 385.396 113.06 369.401C112.634 341.539 129.221 314.333 161.534 303.885C183.253 296.862 206.797 296.823 229.709 296.823C243.033 296.823 255.931 295.864 268.267 300.788C278.64 304.929 288.391 308.882 297.883 314.37C314.259 323.837 328.844 332.522 334.692 349.409C339.98 364.679 347.523 380.431 347.523 396.563C347.523 407.078 338.32 414.002 329.249 420.466C315.321 430.39 300.369 434.308 283.367 438.611C277.169 440.179 270.471 439.589 264.055 439.589C253.41 439.589 242.612 440.003 231.977 439.534C215.112 438.79 195.926 432.001 181.624 424.704C173.349 420.481 162.554 412.383 160.368 404.006C158.159 395.541 159.72 385.673 159.72 377.006C159.72 371.76 159.74 368.3 164.386 364.294C178.457 352.161 199.133 343.371 218.692 339.413C229.73 337.18 241.892 336.914 253.168 336.914C266.228 336.914 281.123 335.146 293.865 337.892C315.88 342.638 330.413 359.451 337.997 376.3C341.315 383.671 343.21 392.079 343.959 399.931C344.622 406.88 343.539 411.175 339.941 417.207C327.64 437.831 295.732 442.345 270.536 445.238C245.883 448.069 220.224 449.367 195.362 449.367C181.408 449.367 167.453 449.367 153.498 449.367C130.957 449.367 107.79 450.688 85.4536 447.846C63.3515 445.034 40.7819 438.844 23.5004 426.877C11.0107 418.227 1.96355 404.457 1.14277 390.696C-1.00684 354.656 21.2979 324.171 55.9027 303.45C64.722 298.169 73.8553 292.922 83.639 288.946C97.3488 283.373 115.637 281.736 130.687 281.231C145.913 280.721 163.988 279.379 178.902 282.209C190.053 284.326 199.778 288.732 209.878 292.966C230.894 301.774 245.968 317.098 260.685 331.808C271.833 342.95 279.076 355.515 282.784 369.672C286.982 385.706 290.366 401.877 290.366 418.293C290.366 422.939 291.176 428.974 288.486 433.233C283.428 441.242 275.385 445.506 266.971 450.888C255.828 458.017 243.889 464.918 230.616 468.924C212.435 474.411 191.442 475.616 172.292 475.769C159.69 475.87 146.996 475.981 135.159 471.803C123.68 467.752 116.046 460.591 107.941 452.789C94.2999 439.66 88.9837 420.701 92.3229 403.625C93.5418 397.392 102.595 391.278 108.006 387.328C118.611 379.585 130.067 372.138 143.13 367.445C162.694 360.416 186.075 360.383 206.962 360.383C225.687 360.383 244.325 363.981 261.204 370.922C278.333 377.966 287.551 389.627 297.948 402.539C318.002 427.445 319.528 455.704 319.528 484.733C319.528 489.133 320.19 491.427 317.195 494.565C311.699 500.325 297.093 501.876 289.07 503.909C281.334 505.87 273.699 507.721 265.546 507.984C239.452 508.825 211.908 509.255 186.419 504.127C180.133 502.862 170.089 500.542 165.293 496.521C162.908 494.522 164.258 487.884 164.645 485.33C167.886 463.934 173.561 443.762 185.123 424.378C189.766 416.594 193.299 408.378 198.797 400.964C205.069 392.505 212.411 384.756 219.858 377.006C242.416 353.532 272.663 334.108 303.586 318.987C309.754 315.971 325.166 324.148 330.609 327.19C335.852 330.12 337.995 339.283 340.525 343.759C344.69 351.132 346.26 358.659 348.69 366.467C354.759 385.969 355.689 407.733 355.689 427.8C355.689 444.589 350.415 458.435 340.525 473.053C327.544 492.238 312.52 509.132 293.865 524.77C281.104 535.467 270.282 547.171 253.622 553.943C236.817 560.773 214.396 562.205 196.01 560.625C185.523 559.723 175.656 553.572 172.616 544.653C170.921 539.682 172.551 532.322 172.551 527.269C172.551 519.467 172.345 511.799 173.717 504.127C174.538 499.541 183.138 494.055 186.549 490.654C193.207 484.017 202.904 478.731 212.6 475.986C227.476 471.776 242.311 465.99 258.158 465.99C270.764 465.99 277.363 467.671 282.2 478.485C286.655 488.443 288.474 499.023 290.949 509.396C292.81 517.195 296.198 525.508 296.198 533.516C296.198 542.807 294.27 548.612 289.07 556.604C283.165 565.679 274.057 577.679 263.083 582.789C231.841 597.339 186.448 602.323 156.415 583.441C148.31 578.346 146.999 574.098 146.888 565.731C146.745 554.922 142.668 542.822 150.647 533.245C159.842 522.208 170.567 512.056 182.531 503.094C195.414 493.443 207.409 480.79 224.459 476.258C234.698 473.537 243.96 468.694 254.334 466.425C261.66 464.823 268.09 460.706 275.461 459.363C282.507 458.079 289.061 457.19 296.263 457.19C303.563 457.19 313.771 455.518 320.565 457.733C348.286 466.77 342.858 502.758 342.858 522.706C342.858 536.769 334.762 556.255 325.231 567.795C322.833 570.699 318.37 579.268 313.436 579.421C308.6 579.571 304.036 580.399 299.179 580.399C291.605 580.399 283.851 569.395 280.451 564.264C278.188 560.85 279.867 553.808 279.867 550.085C279.867 539.569 283.261 528.454 288.033 518.74C291.693 511.288 295.176 502.785 301.123 496.304C307.425 489.436 316.93 483.993 325.749 479.68C332.596 476.332 338.88 472.883 346.357 470.445C349.637 469.376 359.17 468.962 362.104 470.554C370.662 475.195 375.891 485.385 378.759 493.153C384.197 507.881 383.497 523.248 376.685 537.482C363.819 564.368 335.255 589.405 301.642 596.805C285.525 600.353 269.505 599.956 252.973 599.956C241.853 599.956 229.802 601.328 219.21 597.946C198.608 591.366 175.579 576.419 164.126 560.625C154.726 547.66 156.22 532.74 156.22 518.088C156.22 492.659 159.997 468.02 170.736 444.098C180.361 422.66 196.026 407.056 219.21 395.042C241.163 383.666 265.665 374.434 290.107 367.445C308.162 362.283 331.417 358.183 348.69 366.739C366.755 375.688 380.986 386.6 390.683 402.43C398.247 414.778 402.348 431.132 402.348 444.912C402.348 460.101 400.691 472.587 394.766 487.014C389.07 500.885 380.555 514.66 368.585 525.531C358.247 534.919 345.954 550.085 328.6 550.085C322.145 550.085 314.862 529.032 314.862 523.466C314.862 510.325 313.56 496.753 315.38 483.7C317.318 469.806 325.427 460.011 332.618 447.955C338.321 438.393 343.541 429 350.116 419.814C353.464 415.136 355.799 409.512 361.262 406.342C368.06 402.397 380.546 404.386 388.804 404.386C397.63 404.386 401.483 409.381 406.107 414.599C416.892 426.769 417.669 442.101 420.493 456.647C422.101 464.923 424.563 473.161 423.215 481.636C421.631 491.596 410.34 503.968 403.32 511.569C387.354 528.857 358.801 531.135 336.507 520.533C328.045 516.509 316.838 511.958 313.242 503.583C308.502 492.547 310.774 479.538 309.613 468.055C308.083 452.921 307.945 436.372 311.362 421.444C313.998 409.933 318.841 400.563 324.194 389.936C328.758 380.875 336.051 373.928 342.209 365.815C346.134 360.645 351.723 360.536 358.67 359.622C369.048 358.258 377.977 363.519 384.203 370.161C389.835 376.17 394.18 382.236 398.201 389.175C401.111 394.198 402.761 398.988 404.681 404.386C406.546 409.627 408.987 416.55 409.347 421.987C410.184 434.613 414.013 447.693 414.013 460.612C414.013 470.554 414.013 480.495 414.013 490.437C414.013 499.69 414.013 508.943 414.013 518.197C414.013 527.458 412.852 537.638 415.244 546.663C415.887 549.089 418.54 545.15 418.679 544.218C418.951 542.395 424.063 544.959 425.419 545.414C432.55 547.805 454.846 562.717 453.5 567.795C450.588 578.781 503 681.446 503 692.7" stroke="black" strokeLinecap="round"></path>
              </svg>
              <div className=" grid gap-6 md:grid-cols-2 pt-20">
                <div className="w-full sticky top-0 flex items-start justify-between">
                  <div className="w-full">
                    <h2 className="mt-8 text-4xl font-semibold max-w-sm">
                      Hiring top talent globally is hard
                    </h2>
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-10 rounded-2xl p-10">
                  {[1, 2, 3].map((i, idx) => (
                    <div className="flex gap-5 items-center border border-[#6f6f6f69] p-6 rounded-xs" key={i} data-index={idx}>
                      <span className="w-[10%]"><Search /></span>
                      <p className="text-lg font-light">Sourcing top talent around the world requires significant recruitment output</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full flex items-center justify-center -mt-10">
              <div className="p-3 z-1 bg-background text-foreground w-[11rem] h-[11rem] rounded-full translate-y-[50%]">
                <div className="p-10  relative flex items-center justify-center h-full w-full font-bold text-6xl  rounded-full round-home-logo">
                  <p className=" text-black">
                    <AtomIcon size={60} className="text-primary-foreground -mt-0.5" />
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="container w-full mx-auto  ">
            <div className="container flex flex-col gap-28">
              <div ref={sectionRef} className="h-[300vh] relative flex gap-6">
                <div className="h-screen w-[52%] sticky top-0  flex justify-between">
                  <div className="w-full mt-56">
                    <h2 className="mb-10 text-4xl  font-semibold text-pretty ">
                      We Solve This
                    </h2>
                    <div className="flex flex-col gap-3 text-muted-foreground text-sm mt-6">
                      {[
                        'Define your hiring needs and set requirements, AI will help you source the best candidates',
                        'AI matches candidates to your job postings and ranks them based on skills and experience',
                        'Schedule interviews with top candidates and assess their qualifications using AI insights',
                        'Seamlessly onboard your new hires and manage their progress with the help of AI tools'
                      ]
                        .map((label, index) => (
                          <div
                            key={index} className="flex  gap-5 items-center"
                          >
                            <p className={`p-2 font-semibold text-lg transition-all duration-500 rounded-full h-[3.5rem] min-w-[3.5rem] flex items-center justify-center ${index === activeIndex
                              ? ' bg-primary/20  text-primary '
                              : 'bg-muted text-muted-foreground'
                              }`}>{index + 1}</p>
                            <p className={`transition-colors w-full text-lg ${index === activeIndex
                              ? 'text-primary font-medium'
                              : 'text-muted-foreground'
                              }`}>{label}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="w-[20%] relative">
                    <div
                      className="h-full w-2 absolute right-0 top-0 bg-background home-line"
                    >
                      <motion.div
                        style={{
                          height,
                          boxShadow: "0px 0px 10px 2px rgba(62, 207, 142, 0.5)",
                        }}
                        className="w-2 bg-primary"
                      />
                    </div>
                  </div>

                </div>
                <div className="h-full w-[49%] flex flex-col justify-between gap-10 rounded-2xl pt-56 px-10">

                  {['https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e869db75b4f4e2ae14a213_Tell%20Zara%20your%20hiring%20requirements%20(1)-p-800.avif', 'https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e869dd9182cd45560d2492_V3%20-%20with%20transcript%20shown%20(55)-p-800.avif', 'https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e9900e2e7bb34d6030015b_Let%20AI%20match%20you%20with%20the%20best%20talent%20(3)-p-800.avif', 'https://cdn.prod.website-files.com/67e70f741502e57481aa429d/67e99016a05e6fcbcb32943a_V3%20-%20with%20transcript%20shown%20(60).avif'].map((i, idx) => (
                    <img
                      key={i}
                      data-index={idx}
                      ref={(el) => (imgRefs.current[idx] = el)}
                      src={i}
                      className="w-full"
                    />
                  ))}

                </div>
              </div>
            </div>
          </section >

          <section className="container w-full mt-60 mx-auto">
            <div className="flex gap-16 items-center justify-between 
    bg-linear-to-b from-transparent via-muted to-surface
    rounded-2xl border border-muted p-5 text-text">

              {/* Left Box */}
              <div className="w-[20%] p-4 space-y-2">
                <img
                  src="https://static.naukimg.com/s/0/0/i/ab-interview-ot.png"
                  alt="Interview"
                  className="w-full rounded-md border border-muted"
                />
                <h2 className="font-semibold text-md text-text">
                  Prepare for your next interview
                </h2>
              </div>

              {/* Right Carousel */}
              <div className="w-[80%]">
                <Carousel opts={{ align: "start" }} className="w-full -my-20">
                  <CarouselContent>
                    {jobCardsData.map((job, index) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <Card className="pt-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-surface border border-muted">
                          <img
                            src={job.banner}
                            alt={`${job.title} Banner`}
                            className="object-cover rounded-t-xl h-40 w-full"
                          />
                          <CardContent className="space-y-2 py-0">
                            <div className="flex items-center gap-3">
                              <img
                                src={job.logo}
                                alt={`${job.company} Logo`}
                                className="h-8 w-8 rounded-full object-cover border border-muted"
                              />
                              <span className="text-sm font-medium text-text">
                                {job.company}
                              </span>
                            </div>

                            <h3 className="text-lg font-semibold text-text">
                              {job.title}
                            </h3>

                            <p className="text-sm text-muted-text">
                              London – {job.location}
                            </p>

                            <div className="flex items-center justify-between pt-2">
                              <Button className="w-full bg-primary text-background hover:opacity-90">
                                Apply Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  <CarouselPrevious className="-left-2" />
                  <CarouselNext className="-right-2" />
                </Carousel>
              </div>
            </div>
          </section>


          <section className="container w-full mt-40 mx-auto  ">
            <h2 className="text-3xl font-semibold my-8">Popular categories</h2>
            <div className="grid grid-cols-5 gap-4">
              {serviceImgs.map((i, idx) => {
                return <div key={idx} className="p-3 bg-card border rounded-lg">
                  <h3 className="py-2 text-lg font-semibold">{i.heading}</h3>
                  <img className="rounded-lg w-full" src={i.img} alt="" />
                </div>
              })}
            </div>

          </section>


          {/* Features */}
          <section id="features" className="py-16">
            <div className="container mx-auto space-y-20 px-0">
              {FEATURES.map((ft, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col-reverse md:flex-row ${idx % 2 === 0 ? "md:flex-row-reverse" : ""} items-center gap-12`}
                >
                  {/* Text */}
                  <div className="w-full md:w-1/2 space-y-4 text-left">
                    <span className="text-xs font-semibold text-muted-text uppercase tracking-wide">
                      {ft.subheading}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold">{ft.heading}</h2>
                    <p className="text-sm md:text-sm text-muted-text">{ft.description}</p>
                    <Link
                      href={ft.cta_link || "/"}
                      className="text-primary font-medium inline-flex items-center gap-1 group hover:underline"
                    >
                      {ft.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Image */}
                  <div className="w-full md:w-1/2 flex justify-center">
                    <img
                      src={ft.image}
                      alt={ft.heading}
                      className="max-w-[500px] border border-muted rounded p-3 bg-surface"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>


          {/* FAQ */}
          <section className="container w-full mt-40 mx-auto  ">
            <div className="flex items-center border p-10 rounded-2xl bg-[#3444da1a]">
              <h2 className="px-10 text-3xl font-semibold my-8 w-full">
                Frequently asked questions
              </h2>
              <div className="w-full">
                <Accordion type="single" className="space-y-2.5" collapsible>
                  <AccordionItem className=" dark:border-white/20 bg-white/40 dark:bg-gray-800/40 cursor-pointer rounded-lg px-4 transition-colors duration-200" value="item-1">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent>
                      Yes. It adheres to the WAI-ARIA design pattern. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad culpa sit obcaecati.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem className=" dark:border-white/20 bg-white/40 dark:bg-gray-800/40 cursor-pointer rounded-lg px-4 transition-colors duration-200" value="item-2">
                    <AccordionTrigger>How do I get started?</AccordionTrigger>
                    <AccordionContent>
                      Simply create an account and follow the onboarding tutorial to get started.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem className=" dark:border-white/20 bg-white/40 dark:bg-gray-800/40 cursor-pointer rounded-lg px-4 transition-colors duration-200" value="item-3">
                    <AccordionTrigger>Is there customer support?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we offer 24/7 customer support through chat, email, and phone.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>


              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section id="testimonials" className="py-20 bg-surface">
            <div className="container mx-auto px-0 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-12">
                Trusted by 3D artists, game devs, and tech studios
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                {TESTIMONIALS.map((testimonial, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded border border-muted bg-background shadow-md space-y-4"
                  >
                    <h3 className="text-sm font-semibold text-text">{testimonial.title}</h3>
                    <p className="text-sm text-muted-text">{testimonial.review}</p>
                    <div className="w-10 border-t border-muted" />
                    <p className="text-xs text-muted-text">
                      <span className="font-semibold text-text">{testimonial.author}</span>
                      <i className="block text-muted-text">{testimonial.position}</i>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-16 bg-background text-center">
            <div className="container mx-auto px-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Skip the bloat. Build your pipeline smarter.
              </h2>
              <p className="text-muted-text max-w-2xl mx-auto mb-6">
                Whether you&apos;re preparing game-ready assets, previewing character rigs, or sharing iterations with your team — absento.ai gives you speed without sacrifice.
              </p>
              <Link href="/sandbox">
                <Button size="lg">Launch Viewer</Button>
              </Link>
            </div>
          </section>



          <Footer />
        </div>
      </div>
    </div>


  );
};

export default Home;
