
export const compareDependencies = (oldDeps: { [key: string]: string }, newDeps: { [key: string]: string }): string[]  => {
    const changedDeps: string[] = [];
    for (const [dep, version] of Object.entries(newDeps)) {
      if (oldDeps[dep] && oldDeps[dep] !== version) {
        changedDeps.push(dep);
      }
    }
    return changedDeps;
}