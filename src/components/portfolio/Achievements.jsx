import {
  ArrowUpRight,
  Award,
  BookOpen,
  Medal,
  Trophy,
} from "lucide-react";

import {
  badges,
  hackathons,
  courses,
} from "@/data/achievements";

const accents = {
  blue: {
    text: "text-quantum-blue",
    border: "group-hover:border-quantum-blue/40",
  },

  violet: {
    text: "text-quantum-violet",
    border: "group-hover:border-quantum-violet/40",
  },

  green: {
    text: "text-quantum-green",
    border: "group-hover:border-quantum-green/40",
  },
};

function AchievementRow({
  item,
  icon: Icon,
}) {
  const accent =
    accents[item.accent] ?? accents.blue;

  const content = (
    <article
      className={`
        group grid gap-5 border-b border-white/[0.08]
        py-8 transition-colors last:border-b-0
        md:grid-cols-[150px_1fr_auto]
        ${accent.border}
      `}
    >
      {/* Date + category */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
          {item.issued}
        </p>

        <p
          className={`
            mt-2 font-mono text-[10px] uppercase
            tracking-[0.16em] opacity-90
            ${accent.text}
          `}
        >
          {item.category}
        </p>
      </div>

      {/* Main content */}
      <div>
        <div className="flex items-start gap-3">
          <Icon
            className={`mt-0.5 size-4 shrink-0 ${accent.text}`}
            strokeWidth={1.7}
          />

          <div>
            <h3 className="text-base font-medium leading-6 text-white">
              {item.name}
            </h3>

            <p className="mt-2 text-sm text-white/60">
              {item.issuer}

              {item.sponsor && (
                <>
                  {" "}
                  <span className="text-white/35">
                    ·
                  </span>{" "}
                  Sponsored by {item.sponsor}
                </>
              )}
            </p>
          </div>
        </div>

        {(item.period ||
          item.date ||
          item.location ||
          item.result) && (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
            {item.result && (
              <span>{item.result}</span>
            )}

            {(item.period || item.date) && (
              <span>
                {item.period ?? item.date}
              </span>
            )}

            {item.location && (
              <span>{item.location}</span>
            )}
          </div>
        )}

        {item.credentialId && (
          <p className="mt-4 max-w-xl break-all font-mono text-[9px] leading-4 text-white/35">
            Credential ID:{" "}
            {item.credentialId}
          </p>
        )}
      </div>

      {/* Link */}
      <div className="flex items-start justify-end">
        {item.href && (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-white/50 transition-colors group-hover:text-white">
            View
            <ArrowUpRight className="size-3" />
          </span>
        )}
      </div>
    </article>
  );

  if (!item.href) {
    return content;
  }

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="block"
    >
      {content}
    </a>
  );
}

function GroupHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <Icon
        className="mt-0.5 size-4 text-white/55"
        strokeWidth={1.7}
      />

      <div>
        <h3 className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-white/80">
          {title}
        </h3>

        <p className="mt-2 text-sm text-white/45">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function Achievements() {
  return (
    <section
      id="achievements"
      className="page-section snap-start py-28 sm:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-quantum-green">
            03 / Achievements
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Achievements & credentials
          </h2>

          <p className="mt-5 leading-7 text-white/55">
            Selected hackathons, technical credentials,
            courses, and training completed across quantum
            computing, computing systems, and related areas.
          </p>
        </div>

        <div className="space-y-16">
          {/* Hackathons */}
          <div>
            <GroupHeader
              icon={Trophy}
              title="Hackathons"
              description="Hackathon participation, project submissions, and competition credentials."
            />

            <div className="border-y border-white/[0.08]">
              {hackathons.map((item) => (
                <AchievementRow
                  key={item.name}
                  item={item}
                  icon={Trophy}
                />
              ))}
            </div>
          </div>

          {/* Badges */}
          <div>
            <GroupHeader
              icon={Medal}
              title="Badges & credentials"
              description="Verified technical achievements and issued credentials."
            />

            <div className="border-y border-white/[0.08]">
              {badges.map((item) => (
                <AchievementRow
                  key={item.name}
                  item={item}
                  icon={Award}
                />
              ))}
            </div>
          </div>

          {/* Courses */}
          <div>
            <GroupHeader
              icon={BookOpen}
              title="Courses & training"
              description="Selected structured courses and technical training programs."
            />

            <div className="border-y border-white/[0.08]">
              {courses.map((item) => (
                <AchievementRow
                  key={item.name}
                  item={item}
                  icon={BookOpen}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}