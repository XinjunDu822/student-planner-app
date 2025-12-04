export function createTaskModel(apiTask = {}) {
  return {
    id: apiTask.id,
    title: apiTask.title || '',
    desc: apiTask.desc || '',
    date: apiTask.date ? new Date(apiTask.date) : new Date(),
    isLate(now = new Date()) { return now >= this.date; }
  };
}