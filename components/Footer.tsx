import React from 'react';
import { Link } from "@nextui-org/react";

const Footer = () => {
    return (
        <footer className="w-full border-t border-gray-200 mt-auto">
            <div className="mx-auto w-full max-w-7xl px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    {/*<div className="space-y-4">*/}
                    {/*    <h3 className="text-lg font-semibold">idk lol</h3>*/}
                    {/*    <div className="flex flex-col space-y-2">*/}
                    {/*        <Link href="#" color="foreground" size="sm">Posts</Link>*/}
                    {/*        <Link href="#" color="foreground" size="sm">Comments</Link>*/}
                    {/*        <Link href="#" color="foreground" size="sm">Forum</Link>*/}
                    {/*        <Link href="#" color="foreground" size="sm">My Account</Link>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/* Legal */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Legal</h3>
                        <div className="flex flex-col space-y-2">
                            <Link href="https://rule34.xxx/index.php?page=tos" color="foreground" size="sm">Terms of Service</Link>
                            <Link href="mailto:staff@booru.org" color="foreground" size="sm">Contact Us</Link>
                            <Link href="mailto:dmca@booru.org" color="foreground" size="sm">DMCA</Link>
                        </div>
                    </div>

                    {/* Social */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">This is just a better website of rule34.xxx</h3>
                        <p>We using their API, this is not fully my project.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
