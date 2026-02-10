import{Ba as Z,Qa as ee,Ra as te,Sa as ne,Ta as D,Wa as re,Ya as ie,Za as oe,c as W,db as T,eb as x,g as X,h as Y}from"./chunk-D6A6RGIH.js";import{$a as $,Bb as w,Cb as S,Db as v,Hb as g,Ib as L,Jb as C,Kb as z,Mb as d,Na as c,Nb as p,P as q,R as M,U as N,Ub as G,V as B,Vb as m,Wb as j,X as Q,Xb as E,Z as u,ab as P,cb as V,cc as J,db as H,eb as l,fa as A,ha as h,i as R,l as F,oa as _,oc as K,ra as U,sa as I,ua as k,ub as s,vb as y,wb as b}from"./chunk-QQJP54RX.js";function Ve(t){t||(t=u(h));let r=new R(e=>{if(t.destroyed){e.next();return}return t.onDestroy(e.next.bind(e))});return e=>e.pipe(q(r))}function He(t,r){let e=r?.injector??u(A),i=new F(1),n=U(()=>{let a;try{a=t()}catch(o){I(()=>i.error(o));return}I(()=>i.next(a))},{injector:e,manualCleanup:!0});return e.get(h).onDestroy(()=>{n.destroy(),i.complete()}),i.asObservable()}function Le(t,r){let i=!r?.manualCleanup?r?.injector?.get(h)??u(h):null,n=le(r?.equal),a;r?.requireSync?a=_({kind:0},{equal:n}):a=_({kind:1,value:r?.initialValue},{equal:n});let o,O=t.subscribe({next:f=>a.set({kind:1,value:f}),error:f=>{a.set({kind:2,error:f}),o?.()},complete:()=>{o?.()}});if(r?.requireSync&&a().kind===0)throw new M(601,!1);return o=i?.onDestroy(O.unsubscribe.bind(O)),K(()=>{let f=a();switch(f.kind){case 1:return f.value;case 2:throw f.error;case 0:throw new M(601,!1)}},{equal:r?.equal})}function le(t=Object.is){return(r,e)=>r.kind===1&&e.kind===1&&t(r.value,e.value)}var ae=`
    .p-card {
        background: dt('card.background');
        color: dt('card.color');
        box-shadow: dt('card.shadow');
        border-radius: dt('card.border.radius');
        display: flex;
        flex-direction: column;
    }

    .p-card-caption {
        display: flex;
        flex-direction: column;
        gap: dt('card.caption.gap');
    }

    .p-card-body {
        padding: dt('card.body.padding');
        display: flex;
        flex-direction: column;
        gap: dt('card.body.gap');
    }

    .p-card-title {
        font-size: dt('card.title.font.size');
        font-weight: dt('card.title.font.weight');
    }

    .p-card-subtitle {
        color: dt('card.subtitle.color');
    }
`;var de=["header"],pe=["title"],ue=["subtitle"],me=["content"],fe=["footer"],ye=["*",[["p-header"]],[["p-footer"]]],be=["*","p-header","p-footer"];function ge(t,r){t&1&&v(0)}function ve(t,r){if(t&1&&(y(0,"div",1),C(1,1),l(2,ge,1,0,"ng-container",2),b()),t&2){let e=g();m(e.cx("header")),s("pBind",e.ptm("header")),c(2),s("ngTemplateOutlet",e.headerTemplate||e._headerTemplate)}}function he(t,r){if(t&1&&(w(0),j(1),S()),t&2){let e=g(2);c(),E(e.header)}}function _e(t,r){t&1&&v(0)}function Te(t,r){if(t&1&&(y(0,"div",1),l(1,he,2,1,"ng-container",3)(2,_e,1,0,"ng-container",2),b()),t&2){let e=g();m(e.cx("title")),s("pBind",e.ptm("title")),c(),s("ngIf",e.header&&!e._titleTemplate&&!e.titleTemplate),c(),s("ngTemplateOutlet",e.titleTemplate||e._titleTemplate)}}function Ce(t,r){if(t&1&&(w(0),j(1),S()),t&2){let e=g(2);c(),E(e.subheader)}}function De(t,r){t&1&&v(0)}function xe(t,r){if(t&1&&(y(0,"div",1),l(1,Ce,2,1,"ng-container",3)(2,De,1,0,"ng-container",2),b()),t&2){let e=g();m(e.cx("subtitle")),s("pBind",e.ptm("subtitle")),c(),s("ngIf",e.subheader&&!e._subtitleTemplate&&!e.subtitleTemplate),c(),s("ngTemplateOutlet",e.subtitleTemplate||e._subtitleTemplate)}}function Me(t,r){t&1&&v(0)}function Ie(t,r){t&1&&v(0)}function ke(t,r){if(t&1&&(y(0,"div",1),C(1,2),l(2,Ie,1,0,"ng-container",2),b()),t&2){let e=g();m(e.cx("footer")),s("pBind",e.ptm("footer")),c(2),s("ngTemplateOutlet",e.footerTemplate||e._footerTemplate)}}var we=`
    ${ae}

    .p-card {
        display: block;
    }
`,Se={root:"p-card p-component",header:"p-card-header",body:"p-card-body",caption:"p-card-caption",title:"p-card-title",subtitle:"p-card-subtitle",content:"p-card-content",footer:"p-card-footer"},se=(()=>{class t extends re{name="card";style=we;classes=Se;static \u0275fac=(()=>{let e;return function(n){return(e||(e=k(t)))(n||t)}})();static \u0275prov=N({token:t,factory:t.\u0275fac})}return t})();var ce=new Q("CARD_INSTANCE"),je=(()=>{class t extends oe{$pcCard=u(ce,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=u(T,{self:!0});_componentStyle=u(se);onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}header;subheader;set style(e){Z(this._style(),e)||(this._style.set(e),this.el?.nativeElement&&e&&Object.keys(e).forEach(i=>{this.el.nativeElement.style[i]=e[i]}))}get style(){return this._style()}styleClass;headerFacet;footerFacet;headerTemplate;titleTemplate;subtitleTemplate;contentTemplate;footerTemplate;_headerTemplate;_titleTemplate;_subtitleTemplate;_contentTemplate;_footerTemplate;_style=_(null);getBlockableElement(){return this.el.nativeElement.children[0]}templates;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"header":this._headerTemplate=e.template;break;case"title":this._titleTemplate=e.template;break;case"subtitle":this._subtitleTemplate=e.template;break;case"content":this._contentTemplate=e.template;break;case"footer":this._footerTemplate=e.template;break;default:this._contentTemplate=e.template;break}})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=k(t)))(n||t)}})();static \u0275cmp=$({type:t,selectors:[["p-card"]],contentQueries:function(i,n,a){if(i&1&&z(a,ee,5)(a,te,5)(a,de,4)(a,pe,4)(a,ue,4)(a,me,4)(a,fe,4)(a,ne,4),i&2){let o;d(o=p())&&(n.headerFacet=o.first),d(o=p())&&(n.footerFacet=o.first),d(o=p())&&(n.headerTemplate=o.first),d(o=p())&&(n.titleTemplate=o.first),d(o=p())&&(n.subtitleTemplate=o.first),d(o=p())&&(n.contentTemplate=o.first),d(o=p())&&(n.footerTemplate=o.first),d(o=p())&&(n.templates=o)}},hostVars:4,hostBindings:function(i,n){i&2&&(G(n._style()),m(n.cn(n.cx("root"),n.styleClass)))},inputs:{header:"header",subheader:"subheader",style:"style",styleClass:"styleClass"},features:[J([se,{provide:ce,useExisting:t},{provide:ie,useExisting:t}]),V([T]),H],ngContentSelectors:be,decls:8,vars:11,consts:[[3,"pBind","class",4,"ngIf"],[3,"pBind"],[4,"ngTemplateOutlet"],[4,"ngIf"]],template:function(i,n){i&1&&(L(ye),l(0,ve,3,4,"div",0),y(1,"div",1),l(2,Te,3,5,"div",0)(3,xe,3,5,"div",0),y(4,"div",1),C(5),l(6,Me,1,0,"ng-container",2),b(),l(7,ke,3,4,"div",0),b()),i&2&&(s("ngIf",n.headerFacet||n.headerTemplate||n._headerTemplate),c(),m(n.cx("body")),s("pBind",n.ptm("body")),c(),s("ngIf",n.header||n.titleTemplate||n._titleTemplate),c(),s("ngIf",n.subheader||n.subtitleTemplate||n._subtitleTemplate),c(),m(n.cx("content")),s("pBind",n.ptm("content")),c(2),s("ngTemplateOutlet",n.contentTemplate||n._contentTemplate),c(),s("ngIf",n.footerFacet||n.footerTemplate||n._footerTemplate))},dependencies:[Y,W,X,D,x,T],encapsulation:2,changeDetection:0})}return t})(),ft=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=P({type:t});static \u0275inj=B({imports:[je,D,x,D,x]})}return t})();export{Ve as a,He as b,Le as c,je as d,ft as e};
