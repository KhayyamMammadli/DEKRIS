import type { ReactNode } from 'react';
export function Card({children,className='',title,action}:{children:ReactNode;className?:string;title?:string;action?:ReactNode}){return <div className={'card '+className}>{title&&<div className="card-head"><h3>{title}</h3>{action}</div>}{children}</div>}
