import re
from PIL import Image, ImageDraw, ImageFont  
  
font_path = 'C:/Users/ZachP/Desktop/PrintLayoutLab V1.87/GUIT/fonts_JEW/Fairy.ttf'  
vfm_path = 'C:/Users/ZachP/Desktop/PrintLayoutLab V1.87/GUIT/fonts_JEW/Fairy.vfm'  
  
def read_vfm_kerning(vfm_path):  
    kerning_table = {}  
      
    def parse_inner_dict(inner_dict_str):  
        inner_dict = {}  
        inner_pairs = re.findall(r'"(\w)": "(-?\d+)"', inner_dict_str)  
        for key, value in inner_pairs:  
            inner_dict[key] = int(value)  
        return inner_dict  
  
    with open(vfm_path, "r") as vfm_file:  
        content = vfm_file.read()  
        outer_pairs = re.findall(r'"(\w)": {(.*?)}', content, re.DOTALL)  
          
        for left, inner_dict_str in outer_pairs:  
            inner_dict = parse_inner_dict(inner_dict_str)  
            for right, value in inner_dict.items():  
                pair = (ord(left), ord(right))  
                kerning_table[pair] = float(value)  
    return kerning_table   
  
kerning_table = read_vfm_kerning(vfm_path)  
def apply_kerning(text, kerning_table, scale_factor= 1):  
    kerned_text = []  
    for i in range(len(text) - 1):  
        pair = (ord(text[i]), ord(text[i + 1]))  
        kern_value = kerning_table.get(pair, 0) * scale_factor  
        kerned_text.append((text[i], kern_value))  
    kerned_text.append((text[-1], 0))  
    return kerned_text  


def create_image(text, font_path, font_size=50, line_spacing=10, scale_factor=1):
    lines = text.splitlines()
    kerned_lines = [apply_kerning(line, kerning_table, scale_factor) for line in lines]

    # Load the font with the specified size
    font = ImageFont.truetype(font_path, font_size)

    # Calculate the width of the image
    temp_image = Image.new("RGBA", (1, 1), "white")
    temp_draw = ImageDraw.Draw(temp_image)
    width = max(sum(temp_draw.textlength(char, font=font) + kern for char, kern in line) for line in kerned_lines)

    # Create a blank image with a white background
    height = (font_size + line_spacing) * len(lines) - line_spacing
    image = Image.new("RGBA", (int(width), int(height)), "white")
    draw = ImageDraw.Draw(image)

    # Draw the text with kerning
    x = 0
    y = 0
    for line in kerned_lines:
        x = 0
        for i, (char, kern) in enumerate(line):
            draw.text((x, y), char, font=font, fill="black")
            x += draw.textlength(char, font=font)
            if i < len(line) - 1:
                x += kern
        y += font_size + line_spacing

    return image

text = "Jason"
# text = "Aa Ab Ac Ad Ae Af Ag Ah Ai Aj Ak Al Am An Ao Ap Aq Ar As At Au Av Aw Ax Ay Az\nBa Bb Bc Bd Be Bf Bg Bh Bi Bj Bk Bl Bm Bn Bo Bp Bq Br Bs Bt Bu Bv Bw Bx By Bz\nCa Cb Cc Cd Ce Cf Cg Ch Ci Cj Ck Cl Cm Cn Co Cp Cq Cr Cs Ct Cu Cv Cw Cx Cy Cz\nDa Db Dc Dd De Df Dg Dh Di Dj Dk Dl Dm Dn Do Dp Dq Dr Ds Dt Du Dv Dw Dx Dy Dz\nEa Eb Ec Ed Ee Ef Eg Eh Ei Ej Ek El Em En Eo Ep Eq Er Es Et Eu Ev Ew Ex Ey Ez\nFa Fb Fc Fd Fe Ff Fg Fh Fi Fj Fk Fl Fm Fn Fo Fp Fq Fr Fs Ft Fu Fv Fw Fx Fy Fz\nGa Gb Gc Gd Ge Gf Gg Gh Gi Gj Gk Gl Gm Gn Go Gp Gq Gr Gs Gt Gu Gv Gw Gx Gy Gz\nHa Hb Hc Hd He Hf Hg Hh Hi Hj Hk Hl Hm Hn Ho Hp Hq Hr Hs Ht Hu Hv Hw Hx Hy Hz\nIa Ib Ic Id Ie If Ig Ih Ii Ij Ik Il Im In Io Ip Iq Ir Is It Iu Iv Iw Ix Iy Iz\nJa Jb Jc Jd Je Jf Jg Jh Ji Jj Jk Jl Jm Jn Jo Jp Jq Jr Js Jt Ju Jv Jw Jx Jy Jz\nKa Kb Kc Kd Ke Kf Kg Kh Ki Kj Kk Kl Km Kn Ko Kp Kq Kr Ks Kt Ku Kv Kw Kx Ky Kz\nLa Lb Lc Ld Le Lf Lg Lh Li Lj Lk Ll Lm Ln Lo Lp Lq Lr Ls Lt Lu Lv Lw Lx Ly Lz\nMa Mb Mc Md Me Mf Mg Mh Mi Mj Mk Ml Mm Mn Mo Mp Mq Mr Ms Mt Mu Mv Mw Mx My Mz\nNa Nb Nc Nd Ne Nf Ng Nh Ni Nj Nk Nl Nm Nn No Np Nq Nr Ns Nt Nu Nv Nw Nx Ny Nz\nOa Ob Oc Od Oe Of Og Oh Oi Oj Ok Ol Om On Oo Op Oq Or Os Ot Ou Ov Ow Ox Oy Oz\nPa Pb Pc Pd Pe Pf Pg Ph Pi Pj Pk Pl Pm Pn Po Pp Pq Pr Ps Pt Pu Pv Pw Px Py Pz\nQa Qb Qc Qd Qe Qf Qg Qh Qi Qj Qk Ql Qm Qn Qo Qp Qq Qr Qs Qt Qu Qv Qw Qx Qy Qz\nRa Rb Rc Rd Re Rf Rg Rh Ri Rj Rk Rl Rm Rn Ro Rp Rq Rr Rs Rt Ru Rv Rw Rx Ry Rz\nSa Sb Sc Sd Se Sf Sg Sh Si Sj Sk Sl Sm Sn So Sp Sq Sr Ss St Su Sv Sw Sx Sy Sz\nTa Tb Tc Td Te Tf Tg Th Ti Tj Tk Tl Tm Tn To Tp Tq Tr Ts Tt Tu Tv Tw Tx Ty Tz\nUa Ub Uc Ud Ue Uf Ug Uh Ui Uj Uk Ul Um Un Uo Up Uq Ur Us Ut Uu Uv Uw Ux Uy Uz\nVa Vb Vc Vd Ve Vf Vg Vh Vi Vj Vk Vl Vm Vn Vo Vp Vq Vr Vs Vt Vu Vv Vw Vx Vy Vz\nWa Wb Wc Wd We Wf Wg Wh Wi Wj Wk Wl Wm Wn Wo Wp Wq Wr Ws Wt Wu Wv Ww Wx Wy Wz\nXa Xb Xc Xd Xe Xf Xg Xh Xi Xj Xk Xl Xm Xn Xo Xp Xq Xr Xs Xt Xu Xv Xw Xx Xy Xz\nYa Yb Yc Yd Ye Yf Yg Yh Yi Yj Yk Yl Ym Yn Yo Yp Yq Yr Ys Yt Yu Yv Yw Yx Yy Yz\nZa Zb Zc Zd Ze Zf Zg Zh Zi Zj Zk Zl Zm Zn Zo Zp Zq Zr Zs Zt Zu Zv Zw Zx Zy Zz\naa ab ac ad ae af ag ah ai aj ak al am an ao ap aq ar as at au av aw ax ay az\nba bb bc bd be bf bg bh bi bj bk bl bm bn bo bp bq br bs bt bu bv bw bx by bz\nca cb cc cd ce cf cg ch ci cj ck cl cm cn co cp cq cr cs ct cu cv cw cx cy cz\nda db dc dd de df dg dh di dj dk dl dm dn do dp dq dr ds dt du dv dw dx dy dz\nea eb ec ed ee ef eg eh ei ej ek el em en eo ep eq er es et eu ev ew ex ey ez\nfa fb fc fd fe ff fg fh fi fj fk fl fm fn fo fp fq fr fs ft fu fv fw fx fy fz\nga gb gc gd ge gf gg gh gi gj gk gl gm gn go gp gq gr gs gt gu gv gw gx gy gz\nha hb hc hd he hf hg hh hi hj hk hl hm hn ho hp hq hr hs ht hu hv hw hx hy hz\nia ib ic id ie if ig ih ii ij ik il im in io ip iq ir is it iu iv iw ix iy iz\nja jb jc jd je jf jg jh ji jj jk jl jm jn jo jp jq jr js jt ju jv jw jx jy jz\nka kb kc kd ke kf kg kh ki kj kk kl km kn ko kp kq kr ks kt ku kv kw kx ky kz\nla lb lc ld le lf lg lh li lj lk ll lm ln lo lp lq lr ls lt lu lv lw lx ly lz\nma mb mc md me mf mg mh mi mj mk ml mm mn mo mp mq mr ms mt mu mv mw mx my mz\nna nb nc nd ne nf ng nh ni nj nk nl nm nn no np nq nr ns nt nu nv nw nx ny nz\noa ob oc od oe of og oh oi oj ok ol om on oo op oq or os ot ou ov ow ox oy oz\npa pb pc pd pe pf pg ph pi pj pk pl pm pn po pp pq pr ps pt pu pv pw px py pz\nqa qb qc qd qe qf qg qh qi qj qk ql qm qn qo qp qq qr qs qt qu qv qw qx qy qz\nra rb rc rd re rf rg rh ri rj rk rl rm rn ro rp rq rr rs rt ru rv rw rx ry rz\nsa sb sc sd se sf sg sh si sj sk sl sm sn so sp sq sr ss st su sv sw sx sy sz\nta tb tc td te tf tg th ti tj tk tl tm tn to tp tq tr ts tt tu tv tw tx ty tz\nua ub uc ud ue uf ug uh ui uj uk ul um un uo up uq ur us ut uu uv uw ux uy uz\nva vb vc vd ve vf vg vh vi vj vk vl vm vn vo vp vq vr vs vt vu vv vw vx vy vz\nwa wb wc wd we wf wg wh wi wj wk wl wm wn wo wp wq wr ws wt wu wv ww wx wy wz\nxa xb xc xd xe xf xg xh xi xj xk xl xm xn xo xp xq xr xs xt xu xv xw xx xy xz\nya yb yc yd ye yf yg yh yi yj yk yl ym yn yo yp yq yr ys yt yu yv yw yx yy yz\nza zb zc zd ze zf zg zh zi zj zk zl zm zn zo zp zq zr zs zt zu zv zw zx zy zz"
font_size = 240  
line_spacing = 100  
scale_factor = 0.28
image = create_image(text, font_path, font_size, line_spacing, scale_factor)  
image.show()  

image.save("output.png")
