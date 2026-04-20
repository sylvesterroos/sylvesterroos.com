{
  buildNpmPackage,
  nix-gitignore,
}:

# TODO: how to keep package-lock.json and deno.lock in sync?
buildNpmPackage {
  pname = "sylvesterroos-com";
  version = "0.1.0";

  src = nix-gitignore.gitignoreSource [ ] ../.;

  npmDepsHash = "sha256-xDpnPv6ibP4pEPi/B1GeN7QTcGrMvoMccAFTMFg/lp8=";

  # TODO: make this overidable as only the server requires this to prevent SIGILL
  NAPI_RS_FORCE_WASI = "1";

  # TODO: what does this do?
  npmFlags = [ "--ignore-scripts" ];

  buildPhase = ''
    npx astro build
  '';

  installPhase = ''
    cp -R ./dist/. $out/
  '';
}
