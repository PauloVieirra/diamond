import React from 'react';

const Terms = () => {
    return (
        <div style={{ backgroundColor: '#F3F4F6'}}>
            <div style={{ position: 'absolute', bottom: 0, right: 0, top:50, overflow: 'hidden', inset: '0', margin: 'auto', marginTop:'50px' }}>
                <img style={{ width: '100%', height: '100%' }} src="https://d33wubrfki0l68.cloudfront.net/1e0fc04f38f5896d10ff66824a62e466839567f8/699b5/images/hero/3/background-pattern.png" alt="" />
            </div>

            <header style={{ paddingTop: '1rem', paddingBottom: '1.5rem' }}>
                <div style={{ maxWidth: '100%', padding: '0 1rem', margin: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <a href="#" title="" style={{ display: 'flex', borderRadius: '0.375rem', outline: 'none', focusRing: '1', focusRingColor: '#111827', focusRingOffset: '0.125rem' }}>
                                <img style={{ width: 'auto', height: '2rem' }} src="https://d33wubrfki0l68.cloudfront.net/682a555ec15382f2c6e7457ca1ef48d8dbb179ac/f8cd3/images/logo.svg" alt="" />
                            </a>
                        </div>

                        <div style={{ display: 'flex' }}>
                            <button type="button" style={{ color: '#111827' }}>
                                <svg style={{ width: '1.75rem', height: '1.75rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </button>
                        </div>

                        <div style={{ display: 'none' }}>
                            <a href="#" title="" style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', transition: 'all 0.2s', borderRadius: '0.375rem', outline: 'none', focusRing: '1', focusRingColor: '#111827', focusRingOffset: '0.125rem' }}> Solutions </a>

                            <a href="#" title="" style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', transition: 'all 0.2s', borderRadius: '0.375rem', outline: 'none', focusRing: '1', focusRingColor: '#111827', focusRingOffset: '0.125rem' }}> Industries </a>

                            <a href="#" title="" style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', transition: 'all 0.2s', borderRadius: '0.375rem', outline: 'none', focusRing: '1', focusRingColor: '#111827', focusRingOffset: '0.125rem' }}> Fees </a>

                            <a href="#" title="" style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', transition: 'all 0.2s', borderRadius: '0.375rem', outline: 'none', focusRing: '1', focusRingColor: '#111827', focusRingOffset: '0.125rem' }}> About Rareblocks </a>
                        </div>

                        <div style={{ display: 'none' }}>
                            <a href="#" title="" style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', transition: 'all 0.2s', borderRadius: '0.375rem', outline: 'none', focusRing: '1', focusRingColor: '#111827', focusRingOffset: '0.125rem' }}> Sign in </a>

                            <a href="#" title="" style={{ padding: '0.625rem 1.25rem', fontSize: '1rem', fontWeight: '700', lineHeight: '1.75rem', color: '#FFFFFF', transition: 'all 0.2s', backgroundColor: '#111827', border: '0.125rem solid transparent', borderRadius: '1rem', outline: 'none', focusRing: '2', focusRingOffset: '0.125rem', focusRingColor: '#111827' }} role="button">
                                Create free account
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <section style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
                <div style={{ padding: '0 1rem', margin: 'auto', maxWidth: '80rem' }}>
                    <div style={{ display: 'flex', gap: '3rem', gridTemplateRows: '1fr', alignItems: 'center' }}>
                    <div style={{width:'50%'}}>
                            <div style={{ textAlign: 'center'}}>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.2', color: '#111827', transition: 'all 0.2s', fontFamily: 'Source Sans Pro' }}>A special credit card made for Developers.</h1>
                                <p style={{ marginTop: '0.75rem', fontSize: '1.125rem', color: '#4B5563', transition: 'all 0.2s', fontFamily: 'Inter' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula massa in enim luctus. Rutrum arcu.</p>

                                <form action="#" method="POST" style={{ marginTop: '1.25rem',border: '0.125rem solid #CBD5E0', borderRadius: '0.75rem', outline: 'none', focusRing: '1', focusRingColor: '#111827', focusRingOffset: '0.125rem', backgroundColor: 'transparent' }} className="sm:border-none sm:focus:ring-0 sm:focus:border-transparent">
                                    <div style={{ display:'flex', width:'100%',justifyContent:'space-between', alignItems:'center' ,position: 'relative', outline: 'none', focusRing: '1', focusRingColor: '#111827', focusRingOffset: '0.125rem'}}>
                                        <input
                                            type="email"
                                            name=""
                                            id=""
                                            placeholder="Enter email address"
                                            style={{ width: '100%', padding: '1rem', color: '#111827', placeholderColor: '#111827', backgroundColor: 'transparent', outline: 'none', focusRing: '1', focusRingColor: '#111827', focusRingOffset: '0.125rem', borderRadius: '0.75rem', fontFamily: 'Inter' }}
                                            required=""
                                        />
                                        <div style={{  display: 'flex', alignItems: 'center', paddingRight: '0.5rem', outline: 'none', focusRing: '1', focusRingColor: '#111827', focusRingOffset: '0.125rem' }}>
                                            <button type="submit" style={{ width:'100%',padding: '1.5rem', fontSize: '1.125rem', fontWeight: '700',  color: '#FFFFFF', transition: 'all 0.2s', backgroundColor: '#111827', borderRadius: '1rem', outline: 'none', focusRing: '1', focusRingColor: '#111827', focusRingOffset: '0.125rem' }} className="font-pj hover:bg-gray-600">
                                                Get Free Card
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2.5rem', gap: '1.5rem', justifyContent: 'flex-start', }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <p style={{ fontSize: '2.5rem', fontWeight: '500', color: '#111827', fontFamily: 'Source Sans Pro' }}>2943</p>
                                    <p style={{ marginLeft: '0.75rem', fontSize: '0.875rem', color: '#111827', fontFamily: 'Source Sans Pro' }}>Cards<br />Delivered</p>
                                </div>

                                <div style={{ display: 'none' }}>
                                    <svg style={{ color: '#6B7280' }} width="16" height="39" viewBox="0 0 16 39" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <line x1="0.72265" y1="10.584" x2="15.7226" y2="0.583975"></line>
                                        <line x1="0.72265" y1="17.584" x2="15.7226" y2="7.58398"></line>
                                        <line x1="0.72265" y1="24.584" x2="15.7226" y2="14.584"></line>
                                        <line x1="0.72265" y1="31.584" x2="15.7226" y2="21.584"></line>
                                        <line x1="0.72265" y1="38.584" x2="15.7226" y2="28.584"></line>
                                    </svg>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <p style={{ fontSize: '2.5rem', fontWeight: '500', color: '#111827', fontFamily: 'Source Sans Pro' }}>$1M+</p>
                                    <p style={{ marginLeft: '0.75rem', fontSize: '0.875rem', color: '#111827', fontFamily: 'Source Sans Pro' }}>Transaction<br />Completed</p>
                                </div>
                            </div>
                        </div>

                        <div style={{width:'50%'}}>
                            <img style={{ width: '100%' }} src="https://d33wubrfki0l68.cloudfront.net/a78a55b3add0dc26d3587d02ecc23bebc28bf5f8/67091/images/hero/5.2/illustration.png" alt="" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Terms;

