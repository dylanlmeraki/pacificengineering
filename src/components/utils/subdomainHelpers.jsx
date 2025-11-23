// Subdomain detection and routing utilities
export const getSubdomain = () => {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // For localhost development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('subdomain');
  }
  
  // For production domains like clientportal.pacificengineeringsf.com
  if (parts.length >= 3) {
    return parts[0];
  }
  
  return null;
};

export const isInternalPortal = () => {
  const subdomain = getSubdomain();
  return subdomain === 'internalportal';
};

export const isClientPortal = () => {
  const subdomain = getSubdomain();
  return subdomain === 'clientportal';
};

export const isMainDomain = () => {
  const subdomain = getSubdomain();
  return !subdomain || subdomain === 'www';
};

export const getPortalType = () => {
  if (isInternalPortal()) return 'internal';
  if (isClientPortal()) return 'client';
  return 'public';
};

export const getClientPortalUrl = (path = '/') => {
  if (typeof window === 'undefined') return path;
  
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}${port}${path}?subdomain=clientportal`;
  }
  
  const baseDomain = hostname.split('.').slice(-2).join('.');
  return `${protocol}//clientportal.${baseDomain}${port}${path}`;
};

export const getInternalPortalUrl = (path = '/') => {
  if (typeof window === 'undefined') return path;
  
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}${port}${path}?subdomain=internalportal`;
  }
  
  const baseDomain = hostname.split('.').slice(-2).join('.');
  return `${protocol}//internalportal.${baseDomain}${port}${path}`;
};

export const getMainDomainUrl = (path = '/') => {
  if (typeof window === 'undefined') return path;
  
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}${port}${path}`;
  }
  
  const baseDomain = hostname.split('.').slice(-2).join('.');
  return `${protocol}//${baseDomain}${port}${path}`;
};