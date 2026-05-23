{
  buildNpmPackage,
  nix-gitignore,
}: 

buildNpmPackage {
  pname = "sylvesterroos-com";
  version = "0.1.0";

  src = nix-gitignore.gitignoreSource [ ] ../.;

  npmDepsHash = "sha256-4zVCCFp/u9o5/SfrYTr+Dsp2TMBpPOXq0I9r3zLTGSw=";

  npmDepsFetcherVersion = 2;

  # Force sharp to use WASI instead of native bindings in the sandbox
  NAPI_RS_FORCE_WASI = "1";

  # Skip install scripts so native addons (sharp) don't try to compile;
  # NAPI_RS_FORCE_WASI forces WASI fallback instead
  npmFlags = [ "--ignore-scripts" ];

  buildPhase = ''
    npx astro build
  '';

  installPhase = ''
    cp -R ./dist/. $out/
  '';
}
