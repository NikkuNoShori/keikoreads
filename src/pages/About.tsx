// import ParticlesBg from 'particles-bg';

export const About = () => {
  return (
    <div className="w-full">
      {/* Title section - edge to edge and centered */}
      <div className="w-full bg-white/80 dark:bg-gray-800/80 mb-4">
        <div className="flex flex-col items-center">
          <h1 className="text-5xl text-center mb-2" style={{ fontFamily: "'Allura', cursive" }}>About Me</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 max-w-2xl">
          <div className="prose dark:prose-invert">
            <p className="mb-4">
              Hey there! I'm Alisha Neal—a book lover, ARC reviewer, and the voice behind this cozy little corner
              of the internet. I created this site as a home base for my book reviews, especially for the amazing
              publishers I work with through NetGalley.
            </p>

            <p className="mb-4">
              I read everything—seriously, all genres are fair game—but I have a soft spot for anything Fantasy or
              Horror. Give me magic, monsters, or a little bit of both, and I'm in heaven.
            </p>

            <p className="mb-4">
              When I'm not buried in a book, you'll find me hanging out with my husband, chasing after our son, or
              snuggling up with our dog and cat (they're both professional napping assistants).
            </p>

            <p className="mb-4">
              Thanks for stopping by! Whether you're a fellow reader, a publisher, or just curious about my latest
              reads, I'm glad you're here.
            </p>
          </div>
          <div className="mt-8">
            <img
              src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd28zYTVmdmg1dmw3amhwOG96ZGttcHlvNnV4eXVpc3B5Y3RoN2NuYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AbuQeC846WKOs/giphy.gif"
              alt="Reading Books GIF"
              className="w-full rounded-lg shadow-md"
            />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img
            src="/assets/bookStack.png"
            alt="Stack of Books"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default About; 