export const taskType = {
  1: "New",
  2: "Completed",
  3: "Pending",
  4: "Review",
  5: "On Hold",
  6: "Cancel",
};

export const taskWithColor = {
  1: { name: "New", color: "bg-primary" },
  2: { name: "Complete", color: "bg-success" },
  3: { name: "Pending", color: "bg-info" },
  4: { name: "Review", color: "bg-warning" },
  5: { name: "On Hold", color: "bg-secondary" },
  6: { name: "Cancel", color: "bg-danger" },
};

export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
