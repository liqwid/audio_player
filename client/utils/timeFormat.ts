/**
 * Returns time m:ss format
 * @param duration time in seconds
 */
export function formatAudioDuration(duration: number) {
  duration = Math.floor(duration)
  
  const minutes = Math.floor(duration / 60)
  let seconds = String(duration % 60)

  if (seconds.length === 1) {
    seconds = `0${seconds}`
  }

  return `${minutes}:${seconds}`
}
