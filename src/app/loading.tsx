import AppLogo from '@/components/layout/logo';

const Loading = () => {
  return (
    <div className="z-50 flex flex-col items-center justify-center bg-(--surface-default) h-screen">
      {/* Logo */}
      <AppLogo width={300}/>

      {/* Arc dots */}
      <div className="flex items-center gap-4 my-9">
        {Array.from({ length: 9 }).map((_, index) => (
          <span
            key={index}
            className="h-6 w-3 rounded-full bg-(--color-primary) origin-center"
            style={{ animation: `loading-wave 1.8s ease-in-out ${index * 0.2 - 2.7}s infinite` }}
          />
        ))}
      </div>

      {/* Label */}
      <p className="mt-4 min-w-25 text-left text-sm text-(--text-primary) tracking-[0.2em] uppercase">
        Loading
        <span className="inline-block ml-1 text-(--color-primary)">
          {Array.from({ length: 3 }).map((_, index) => (
            <span
              key={index}
              className="inline-block"
              style={{ animation: `loading-dot-loop 1.05s ease-in-out ${index * 0.2 - 0.6}s infinite` }}
            >
              .
            </span>
          ))}
        </span>
      </p>
    </div>
  );
};

export default Loading;
