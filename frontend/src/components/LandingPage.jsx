import React, { useState, useEffect } from "react";
import {
  Play,
  Code,
  Users,
  Zap,
  Palette,
  Terminal,
  ArrowRight,
  Star,
  Check,
  Github,
  Mail,
  Linkedin,
  Twitter,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeDemo, setActiveDemo] = useState(0);
  let navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % 3);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Live Code Editing",
      description:
        "Collaborate in real-time with instant synchronization across all connected users",
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Interactive Whiteboard",
      description:
        "Draw, sketch, and visualize ideas alongside your code with our integrated whiteboard",
    },
    {
      icon: <Play className="w-8 h-8" />,
      title: "Instant Execution",
      description:
        "Run your code instantly and see results in real-time without any setup",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description:
        "Work together seamlessly with live cursors and real-time presence indicators",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Developer at TechCorp",
      avatar: "bg-purple-500",
      quote:
        "CodeSync has revolutionized how our team collaborates. The real-time features are incredible!",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO at StartupXYZ",
      avatar: "bg-blue-500",
      quote:
        "The whiteboard integration is a game-changer. We can visualize and code simultaneously.",
    },
    {
      name: "Emily Watson",
      role: "Full-Stack Engineer",
      avatar: "bg-pink-500",
      quote:
        "Best coding environment I've used. The instant execution saves hours of setup time.",
    },
  ];

  const demos = [
    {
      title: "Real-time Collaboration",
      description: "Watch as multiple developers code together seamlessly",
    },
    {
      title: "Visual Whiteboard",
      description: "Sketch ideas and create diagrams alongside your code",
    },
    {
      title: "Instant Execution",
      description: "See your code results immediately without any setup",
    },
  ];

  return (
    <div className="relative  bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <nav
        className={`sticky top-0 z-50  flex justify-between items-center p-6 md:p-8 ${
          scrolled
            ? "bg-gradient-to-br from-slate-600 via-purple-900 to-slate-700 "
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Terminal className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold">CodeSync</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a
            href="#features"
            className="hover:text-purple-300 transition-colors"
          >
            Features
          </a>
          <a href="#demos" className="hover:text-purple-300 transition-colors">
            Demos
          </a>

          <a
            href="#contact"
            className="hover:text-purple-300 transition-colors"
          >
            Contact
          </a>
        </div>
        <div className="flex items-center space-x-4">
          {/* <button className="hidden md:block border border-purple-400 px-4 py-2 rounded-full hover:bg-purple-400 hover:bg-opacity-10 transition-all">
            Sign In
          </button> */}
          <button
            onClick={() => navigate("/roompage")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div
          className={`text-center transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
            <Sparkles className="w-4 h-4 mr-2 text-purple-300" />
            <span className="text-sm text-purple-200">
              Now with AI-powered code suggestions
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Code. Create. Collaborate.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-4xl mx-auto">
            The ultimate realtime code editor with integrated whiteboard and
            instant execution. Build amazing projects together with your team,
            visualize complex ideas, and execute code instantly in the cloud.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={() => navigate("/roompage")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Coding Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Check className="w-4 h-4 text-green-400" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center space-x-1">
              <Check className="w-4 h-4 text-green-400" />
              <span>No setup required</span>
            </div>
            <div className="flex items-center space-x-1">
              <Check className="w-4 h-4 text-green-400" />
              <span>Works everywhere</span>
            </div>
          </div>
        </div>

        <div
          className={`mt-20 transform transition-all duration-1000 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden max-w-5xl mx-auto">
            <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-400">fibonacci.js</div>
                <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-300">Live</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-gray-800"></div>
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-gray-800"></div>
                  <div className="w-6 h-6 bg-pink-500 rounded-full border-2 border-gray-800"></div>
                </div>
                <span className="text-xs text-gray-400">3 users online</span>
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 p-6">
                <div className="text-sm text-gray-300 font-mono space-y-1">
                  <div>
                    <span className="text-purple-400">function</span>
                    <span className="text-blue-400"> fibonacci</span>
                    <span className="text-gray-300">(</span>
                    <span className="text-orange-400">n</span>
                    <span className="text-gray-300">) {"{"}</span>
                  </div>
                  <div>
                    <span className="text-gray-300"> </span>
                    <span className="text-purple-400">if</span>
                    <span className="text-gray-300"> (</span>
                    <span className="text-orange-400">n</span>
                    <span className="text-gray-300"> &lt;= </span>
                    <span className="text-yellow-400">1</span>
                    <span className="text-gray-300">) </span>
                    <span className="text-purple-400">return</span>
                    <span className="text-gray-300"> </span>
                    <span className="text-orange-400">n</span>
                    <span className="text-gray-300">;</span>
                  </div>
                  <div>
                    <span className="text-gray-300"> </span>
                    <span className="text-purple-400">return</span>
                    <span className="text-gray-300"> </span>
                    <span className="text-blue-400">fibonacci</span>
                    <span className="text-gray-300">(</span>
                    <span className="text-orange-400">n</span>
                    <span className="text-gray-300"> - </span>
                    <span className="text-yellow-400">1</span>
                    <span className="text-gray-300">) + </span>
                    <span className="text-blue-400">fibonacci</span>
                    <span className="text-gray-300">(</span>
                    <span className="text-orange-400">n</span>
                    <span className="text-gray-300"> - </span>
                    <span className="text-yellow-400">2</span>
                    <span className="text-gray-300">);</span>
                  </div>
                  <div>
                    <span className="text-gray-300">{"}"}</span>
                  </div>
                  <div>&nbsp;</div>
                  <div>
                    <span className="text-gray-300">console.</span>
                    <span className="text-blue-400">log</span>
                    <span className="text-gray-300">(</span>
                    <span className="text-blue-400">fibonacci</span>
                    <span className="text-gray-300">(</span>
                    <span className="text-yellow-400">10</span>
                    <span className="text-gray-300">)); </span>
                    <span className="text-gray-500">// 55</span>
                    <span className="animate-pulse text-white">|</span>
                  </div>
                </div>
              </div>
              <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
                <h4 className="text-sm font-semibold mb-3 text-gray-300">
                  Whiteboard
                </h4>
                <div className="bg-white rounded-lg h-40 mb-4 relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 300 160">
                    <circle
                      cx="60"
                      cy="40"
                      r="20"
                      fill="#8B5CF6"
                      opacity="0.7"
                    />
                    <rect
                      x="120"
                      y="20"
                      width="40"
                      height="40"
                      fill="#EC4899"
                      opacity="0.7"
                      rx="5"
                    />
                    <path
                      d="M200 30 L240 30 L220 60 Z"
                      fill="#06B6D4"
                      opacity="0.7"
                    />
                    <line
                      x1="60"
                      y1="70"
                      x2="120"
                      y2="70"
                      stroke="#6B7280"
                      strokeWidth="2"
                    />
                    <line
                      x1="160"
                      y1="70"
                      x2="220"
                      y2="70"
                      stroke="#6B7280"
                      strokeWidth="2"
                    />
                    <text
                      x="60"
                      y="100"
                      fontSize="12"
                      fill="#374151"
                      textAnchor="middle"
                    >
                      Input
                    </text>
                    <text
                      x="140"
                      y="100"
                      fontSize="12"
                      fill="#374151"
                      textAnchor="middle"
                    >
                      Process
                    </text>
                    <text
                      x="220"
                      y="100"
                      fontSize="12"
                      fill="#374151"
                      textAnchor="middle"
                    >
                      Output
                    </text>
                  </svg>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">
                    Console Output:
                  </div>
                  <div className="text-green-400 font-mono text-sm">55</div>
                  <div className="text-gray-500 text-xs mt-1">
                    Execution time: 0.12ms
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="features" className="relative z-10 py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                  activeFeature === index
                    ? "border-purple-500 shadow-purple-500/20 shadow-lg"
                    : ""
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="text-purple-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        id="demos"
        className="relative z-10 py-20 px-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              See It In Action
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the power of real-time collaboration, visual
              programming, and instant execution.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/3 space-y-4">
              {demos.map((demo, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                    activeDemo === index
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 transform scale-105"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveDemo(index)}
                >
                  <h3 className="text-lg font-semibold mb-2">{demo.title}</h3>
                  <p className="text-gray-300 text-sm">{demo.description}</p>
                </div>
              ))}
            </div>
            <div className="lg:w-2/3">
              <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                    <h3 className="text-xl font-semibold mb-2">
                      {demos[activeDemo].title}
                    </h3>
                    <p className="text-gray-400">
                      {demos[activeDemo].description}
                    </p>
                    <button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all">
                      Play Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Loved by Developers
            </h2>
            <p className="text-xl text-gray-400">
              See what our community has to say
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`w-12 h-12 ${testimonial.avatar} rounded-full flex items-center justify-center text-white font-bold mr-4`}
                  >
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            Ready to Transform Your Coding Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already coding smarter, faster,
            and together. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={() => navigate("/roompage")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <Zap className="w-5 h-5" />
              <span>Get Started Free</span>
            </button>
          </div>
        </div>
      </div>

      <footer
        id="contact"
        className="relative z-10 border-t border-gray-800 py-16 px-6"
      >
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold">CodeSync</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Building the future of collaborative coding. Connect with
                developers worldwide and create amazing software together.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/Akcthecoder200/Realtime-Code-Editor"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/arvindk2/"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>

                <a
                  href="akchoudhary2411@gmail.com"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#demos"
                    className="hover:text-white transition-colors"
                  >
                    Live Demo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 CodeSync. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
