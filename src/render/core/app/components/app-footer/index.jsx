import React from 'react'
import styled from 'styled-components'
import setting from 'root/package.json'

const FooterWrapper = styled.div`
  height: auto;
  width: 100%;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  left: 0;
  bottom: 0;
  padding: 0.7rem 1rem;
`

const Version = styled.div`
  color: #999;
  letter-spacing: 2px;
  font-size: 0.9rem;
  line-height: 1;
`

const Footer = () => {
  return (
    <FooterWrapper>
      <Version>{setting.version}</Version>
    </FooterWrapper>
  )
}

Footer.defaultProps = {
  showLogo: true,
  absolute: true
}

export default React.memo(Footer)
