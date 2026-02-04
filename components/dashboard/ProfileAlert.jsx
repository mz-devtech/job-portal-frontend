"use client";

export default function ProfileAlert({
  title = "Your profile editing is not completed.",
  description = "Complete your profile editing & build your custom Resume",
  buttonText = "Edit Profile →",
  onClick,
}) {
  return (
    <div
      className="
        mt-6
        flex flex-col gap-4
        rounded-lg
        bg-red-500
        px-4 py-4
        text-white
        sm:flex-row sm:items-center sm:justify-between
        sm:px-6 sm:py-5
      "
    >
      {/* Text */}
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-red-100">
          {description}
        </p>
      </div>

      {/* Action */}
      <button
        onClick={onClick}
        className="
          self-start
          rounded-md
          bg-white
          px-4 py-2
          text-sm
          font-medium
          text-red-500
          transition
          hover:bg-red-50
          sm:self-auto
        "
      >
        {buttonText}
      </button>
    </div>
  );
}
