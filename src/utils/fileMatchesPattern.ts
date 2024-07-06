export function fileMatchesPattern(fileName: string, patterns: string[]): boolean {
  const normalizedFileName = fileName.replace(/\\/g, '/');

  const patternsAsRegex = patterns.map(pattern => {
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');

    return new RegExp(`(^|/)${regexPattern}$`)
  });

  return patternsAsRegex.some(regex => regex.test(normalizedFileName));
}
