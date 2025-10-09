import React from "react";

// Reusable Stat Card
const StatCard = ({ value, label }) => (
  <div className="flex flex-col items-center text-center max-w-[200px]">
    <div
      className="bg-no-repeat bg-contain bg-center px-4 py-2 text-lg font-bold mb-2"
      style={{
        backgroundImage:
          "url('https://www.getjobber.com/wp-content/uploads/jobber-assets/img-tape.cd9ed39b.svg')",
      }}
    >
      {value}
    </div>
    <p className="text-white text-sm">{label}</p>
  </div>
);

export default StatCard;
