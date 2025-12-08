namespace Npm {
  export interface PackageInfo {
    name: string;
    version: string;
    repository: {
      url: string;
    };
    homepage: string;
  }
}
