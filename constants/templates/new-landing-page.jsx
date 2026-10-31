import Image from 'next/image';
import Script from 'next/script';
 

const LandingPage = ({ content: data }) => {
  const renderSection = (section) => {
    switch (section.section_type) {
      case 'hero':
        return (
          <section className="hero bg-linear-to-r from-gray-800 via-gray-900 to-black text-white py-20 md:py-32 px-8 md:px-16 text-center rounded-b-lg">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6">{section.heading}</h1>
            <p className="text-lg md:text-xl mb-6 max-w-4xl mx-auto">{section.description}</p>
            <div>
              {section.content.map((item, index) => {
                if (item.type === 'text') {
                  return <p key={index} className="text-md md:text-lg mb-4">{item.text}</p>;
                }
                if (item.type === 'image') {
                  return <img key={index} src={item.src} alt="Hero Image" width={800} height={500} className="mx-auto rounded-lg shadow-xl" />;
                }
                return null;
              })}
            </div>
          </section>
        );
      case 'features':
        return (
          <section className="features bg-gray-900 py-20 md:py-32 px-8 md:px-16">
            <h2 className="text-4xl md:text-6xl font-semibold text-center text-white mb-8">{section.heading}</h2>
            <p className="text-lg md:text-xl text-center text-gray-300 mb-12">{section.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.content.map((item, index) => (
                <div key={index} className="feature-card bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  {item.type === 'image' && <Image src={item.src} alt="Feature Image" width={200} height={200} className="mx-auto rounded-full mb-4" />}
                  {item.type === 'text' && <p className="text-lg md:text-xl text-gray-200">{item.text}</p>}
                </div>
              ))}
            </div>
          </section>
        );
      case 'testimonials':
        return (
          <section className="testimonials bg-gray-800 py-20 md:py-32 px-8 md:px-16">
            <h2 className="text-4xl md:text-6xl font-semibold text-center text-white mb-8">{section.heading}</h2>
            <p className="text-lg md:text-xl text-center text-gray-300 mb-12">{section.description}</p>
            <div className="space-y-8">
              {section.content.map((item, index) => (
                <blockquote key={index} className="testimonial-quote border-l-4 border-blue-500 pl-6 italic text-lg text-gray-300">
                  <p>{item.text}</p>
                </blockquote>
              ))}
            </div>
          </section>
        );
      case 'call_to_action':
        return (
          <section className="cta bg-blue-800 text-white py-20 md:py-32 px-8 md:px-16 text-center">
            <h2 className="text-4xl md:text-6xl font-semibold mb-4">{section.heading}</h2>
            <p className="text-lg md:text-xl mb-8">{section.description}</p>
            <div>
              {section.content.map((item, index) => {
                if (item.type === 'button') {
                  return (
                    <a key={index} href={item.link} className="cta-button inline-block py-3 px-8 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition duration-300 transform hover:scale-105">
                      {item.text}
                    </a>
                  );
                }
                return null;
              })}
            </div>
          </section>
        );
      case 'pricing':
        return (
          <section className="pricing bg-gray-900 py-20 md:py-32 px-8 md:px-16">
            <h2 className="text-4xl md:text-6xl font-semibold text-center text-white mb-8">{section.heading}</h2>
            <p className="text-lg md:text-xl text-center text-gray-300 mb-12">{section.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.content.map((item, index) => (
                <div key={index} className={`pricing-plan p-8 rounded-lg shadow-lg text-center transition-all duration-300 ${index === 1 ? 'bg-indigo-800' : 'bg-gray-800'}`}>
                  <p className="text-xl font-semibold mb-4 text-white">{item.text}</p>
                  {index === 1 && <span className="text-sm text-green-400 bg-green-100 px-3 py-1 rounded-full">Most Popular</span>}
                </div>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };


  return (
    <div className="landing-page bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900 text-white py-4 px-8 fixed w-full top-0 left-0 z-10 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold">BrandName</h1>
          <nav className="space-x-6">
            <a href="#features" className="hover:text-gray-400">Features</a>
            <a href="#pricing" className="hover:text-gray-400">Pricing</a>
            <a href="#cta" className="hover:text-gray-400">Contact</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      {data.sections.map((section, index) => (
        <div key={index}>{renderSection(section)}</div>
      ))}

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-12 px-8 mt-16">
        <div className="text-center">
          <p>&copy; 2026 BrandName. All rights reserved.</p>
          <div className="mt-4">
            <a href="#terms" className="hover:text-gray-300">Terms</a> | <a href="#privacy" className="hover:text-gray-300">Privacy</a>
          </div>
        </div>
      </footer>

      <Script 
        src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" 
        id="bootstrap-cdn"
      />
    </div>
  );
};


export default LandingPage;

