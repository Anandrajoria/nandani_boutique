const REMOTE_OR_PUBLIC_ASSET_PATTERN = /^(https:\/\/.+|\/.+)$/;

function isRemoteOrPublicAsset(value = "") {
  return REMOTE_OR_PUBLIC_ASSET_PATTERN.test(value);
}

module.exports = {
  isRemoteOrPublicAsset,
  REMOTE_OR_PUBLIC_ASSET_PATTERN,
};
