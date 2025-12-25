import { Calendar, Clock } from 'lucide-react';
import HierarchyBar from '~/components/layout/hierarchyBar';
import { Separator } from '~/components/ui/separator';
import { format } from 'date-fns';
import MarkdownrRender from '~/components/layout/markdownrRender';

const markdownContent = `
# Introduction
- **Volume visualization** : 대화형 그래픽(interactive graph)과 이미징 기술을 이용해서 **볼륨 데이터(volumetric data)** 로부터 의미 있는 정보를 추출하는 방법이다.
- 이는 단순히 그리는 것 뿐만 아니라 데이터 표현, 모델링, 조작, 렌더링까지 모두 포괄한다.
- 볼륨 데이터는 주로 샘플링, 시뮬레이션, 모델링을 통해 얻어진다. (ex : MRI, CT, PET 등)
- **표면 렌더링 (Surface Rendering via Geometric Primitives)** : 초기에는 볼륨 데이터 내부에서 **표면**(Surface)을 근사하여 기하학적 도형으로 변환해 그렸다. 다만, 표면만 추출하는 방식은 데이터 내부에 포함된 **정보의 한 차원을 잃어**버리게 된다.
- **볼륨 렌더링 (Volume Rendering)** : 표면 추출 단계 없이, 3**D 데이터 전체를 하나의 2D 이미지로 캡처**하려고 시도하는 기술이다. 이는 표면 렌더링보다 훨씬 더 많은 정보를 전달할 수 있으나 알고리즘 복잡도가 높고, 랜더링 시간이 오래 걸린다.
# Volumetric Data
- 볼룸 데이터 Set은 3차원 공간 $(x, y, z)$ 상의 위치에 있는 샘플을 **복셀**(Voxel)이라고 한다.
- 복셀이 가지는 값 $v$는 데이터의 속성을 나타낸다.
  - **Binary** : 0(배경) 또는 정수(객체 존재)로만 구성된 경우
  - **Multi-valued** : 밀도, 열, 압력 등 측정 가능한 물리적 속성을 나타내는 스칼라 값
  - **Vector** : 속도나 색상처럼 여러 개의 값으로 구성된 값
- 데이터 샘플이 공간에 어떻게 배치되는지에 따라 **Grid 유형**이 나뉜다.
## Regular Grid
- **등방성 (Isotropic)** : 샘플 간의 간격이 3개 축 모두에서 일정하게 배치된 경우
- **이방성 (Anisotropic)** : 샘플 간격이 축마다 서로 다른 상수일 경우
- 이러한 Regular Grid의 경우 주로 **3D 배열 형태**(Volume Buffer)로 저장된다.
## Other Grids
- **Rectilinear Grid** : 셀들이 축에 정렬되어 있지만, 축에 따라 격자 간격이 임의로 다른 경우
- **Curvilinear (Structed) Grid** : 그리드의 위상(topology)은 유지되지만 비선형적으로 변환된 형태. 여기서 논리적 구조는 '**계산 공간(Computational Space)**', 변환된 실제 그리드는 '**물리적 공간(Physical Space)**'이라고 부른다.
- **Unstructured (Irregular) Grid:** 연결성을 명시적으로 지정해야 하는 셀들의 집합으로, 사면체(tetrahedra)나 육면체(hexahedra) 등 임의의 모양을 가질 수 있다.
# Rendering Via Geometric Primitives (Surface Rendering)
- 볼륨 랜더링의 복잡성을 줄이기 위해, 데이터 내부에 있는 표면을 기하학적 프리미티브(삼각형)으로 근사하여 표현한다.
- 이렇게 하면 일반적인 그래픽 가속 하드웨어를 사용할 수 있다.
## iso-surface
- 데이터 값 $v$이 특정 기준 값 이상이면 객체, 미만이면 배경으로 나누는 함수를 사용한다.
- 이 경계면을 **iso-surface**라고 한다.
## iso-contour
- 데이터 값 $v$가 특정 범위 내에 있을 때($[v_1, v_2]$) 객체로 간주하는 함수를 사용한다.
- 단일 경계선이 아니라 특정 두께나 범위를 가진 구조를 추출할 때 사용된다.
## Marching Cubes
- 볼륨을 구성하는 각 격자 셀(Cell)을 하나씩 검사한다.
- 셀의 8개의 **꼭짓점(Volex)** 값이 기준값($v_{iso}$)보다 큰지 작은지 따져 표면이 셀을 어떻게 하는지 결정한다.
- Volex로 표현 가능한 경우의 수가 2^8 이지만, 대칭성을 이용해 **15개의 기본 위상**(base topologies)으로 가짓수를 줄여 처리한다.
- 하지만 데이터가 크면 수백만 개의 삼각형이 생성되어 랜더링 속도가 느려질 수 있다. (Mesh Decimation) 기법을 통해 삼각형 개수를 줄일 수 있다.
## Alternative
- 삼각형이 너무 많아지는 문제를 해결하거나 속도를 높이기 위한 다른 방법들도 존재한다.
	- **Point-based Rendering** : 투영되었들 때 픽셀 크기보다 작은 삼각형을 만드는 대신, 셀을 잘게 쪼개어 Point으로 랜더링 하는 방식
	- **Acceleration** : K-D 트리나 구간 트리 같은 자료구조를 사용하여, 표면이 지나가는 셀만 빠르게 찾아내어 해당 셀만 검사하는 기법
# Direct Volume Rendering : PERLUDE
- Geometric Primitives 즉, 표면 랜더링은 유용하지만 몇 가지 큰 단점이 존재한다.
	- **근사(Approximation)의 한계** : 기하학적 프리미티브는 원본 데이터 내의 표면을 근사할 뿐이다. 정확한 근사를 위해서는 엄청난 양의 프리미티브가 필요하므로, 정확도와 저장 공간 사이에서의 Trad-off가 존재한다.
	- **정보 손실 (Information Loss)** : 표면만 표현하기 위해 때문에 데이터 **내부**에 포함된 많은 정보가 랜더링 과정에서 사라진다.
	- **비정형 현상 표현 불가** : 구름, 안개, 불 같은 **무정형(Amorphous) 현상**은 표면으로 표현하기 어렵다.
- 이러한 문제점을 해결하기 위해 중간에 표면을 추출하는 단계를 거치지 않고 **데이터를 직접 시각화**하는 기술이 필요하다. 이 기술이 **Direct Volume Rendering**이다.
# Volumetric Function Interpolation
- 볼륨 데이터는 격자(Grid) 위의 **이산적인 위치**에서만 값을 가진다.
- 격자점들의 값을 이용해 격자 사이사이의 임의의 위치($x, y, z$)의 값을 추정하는 방법을 **보간**(Interpolation)이라고 한다.
- 이때 사용하는 함수를 **필터**(Filter), 또는 **커널**(Kernel)이라고 부른다.
## 0차 보간 (Zero-order / Nearest-neighbor)
- 해당 위치에서 가장 가까운 격자점의 값을 그대로 가져오는 방법이다.
- 이때 사용하는 함수를 **Box filter**라고 한다. $$f(x,y,z) = V(round(x),round(y),round(z))$$
- 반올림으로 실수들이 정수로 바뀌면서 가까운 값이 되는 방식이다.
- 0차 보간은 계산은 빠르지만, 결과물이 **각져 보이고(staircasing)**, 시각적으로 품질이 가장 떨어진다.
## 1차 보간 (First-order / Trilinear)
- 가장 많이 쓰이는 방법으로 **2D에서는 bi-linear interpolation**, **3D에서는 tri-linear interpolation** 이라고 부른다.
- Trilinear은 X축 → Y축 → Z축  순서로 값을 줄여 나가면서 보간을 수행하는 방식이다.
- 해당 보간 방법을 사용하면 계산 현상이 사라지고 훨씬 더 부드러운 결과를 가지게 된다.
- 다만 미분 불가능한 지점이 있어, **값이 급격하게 변하는 곳에서 띠(banding) 현상**이 보일 수 있다. (Ex, 원이 육각형이나 팔각형처럼 보이는 현상)
- banding 현상은 색깔과 빛에서도 문제가 생기게 되는데, 물체의 빛이 반사되는 각도는 표면의 기울기(법선 벡터)에 따라 결정된다. 
- 1차 보간을 하면 표면이 V자처럼 꺾이게 되는데 이렇게 되면 왼쪽 면은 빛을 잘 받아서 밝은데 오른쪽 면은 꺾이자마자 **갑자기 어두워지는 현상**이 발생한다.
- 따라서 더 고품질의 이미지를 얻으려면, **이 직선들을 부드러운 곡선으로 펴주는 3차 보간(Cubic Interpolation/Spline) 등을 사용**해야 한다.
### X축 방향 보간(4회)
- 8개의 점을 X축 방향으로 짝지어 4번 계산한다. $$f(u,v_{0,1},w_{0,1}) = (1-u)V(0, v_{0,1},w_{0,1}) + u\\cdot V(1, v_{0,1},w_{0,1})$$
- (만약 $u$가 0에 가깝다면 $V(0, ..)$에 더 큰 비중을 두고, 만약 $u$가 1에 가깝다면 $V(1,..)$에 더 큰 비중을 둔다.
- 이를 통해서 점이 8개 → 4개로 줄어든다.
### Y축 방향 보간(2회)
- X축 방향에서 구한 보간 값을 Y축 방향으로 짝지어 2번 계산한다. $$f(u, v, w_{0,1}) = (1-v)f(u,0,w_{0,1}) + v \\cdot f(u,1,w_{0,1})$$
- $v$가 0(아래)에 가까우면 아래쪽 값에, 1(위)에 가까우면 위쪽 값에 가중치를 둔다.
- 이를 통해서 점이 4개 → 2개로 줄어든다.
### Z축 방향 보간(1회)
- Y축 방향에서 구한 보간 값을 Z축 방향으로 짝지어 1번 계산한다. $$f(x,y,z) = f(u,v,w) = (1-w)f(u,v,0) + w \\cdot f(u,v,1)$$
- $w$는 거리를 의미하며, 0(앞)에 가까우면 앞쪽 값에 가중치 1(뒤)에 가까우면 뒤쪽 값에 가중치를 둔다.
- 이를 통해서 점이 2개 → 1개로 줄어들며, 이것이 최종 보간 값이다.
## 고차 보간 (Higher-order / Cubic)
- 1차 보간과 달리 더 넓은 범위의 주변 점들을 사용하여 **곡선 형태**로 값을 추정한다.
### Cardinal Spline (Catmull-Rom spline)
- 1차 보간과 다르게 1차 도함수(기울기)가 연속적이어서 훨씬 부드럽다.
- $u$(거리)에 따른 가중치를 계산하는 $h(u)$ 함수를 사용한다. $$h(u) = \\begin{cases} (a+2)|u|^3 - (a+3)|u|^2 + 1 & \\text {if} &0 \\le|u| < 1 \\\\ a|u|^3 - 5a|u|^2 + 8a|u| -4a & \\text {if} & 1 \\le|u|\\le 2 \\\\ 0 & \\text {if} & |u| > 2 \\end{cases}$$
	-  구간 1($0\\le|u|<1$) 
		- 내가 구하려는 위치 바로 양옆에 있는 점들을 기준으로 구하는 값이다.
		- $u^3$을 사용하여 부드러운 곡선으로 만든다.
	- 구간 2($1\\le|u|<2$)
		- 한 칸 더 멀리 떨어져 있는 점들을 기준으로 구하는 값이다.
		- 이 점들은 직접 값을 주지는 않지만, 곡선이 휘어지는 방향(기울기)을 잡아주는 역할을 한다.
	- 구간 3($|u|\\ge2$) 
		- 2칸 이상 떨어진 점들은 너무 머니까 무시한다.
-  식에 있는 $a$값은 사용자가 조절할 수 있는 값으로 $a$값에 따라 곡선이 팽팽해지거나 느슨해진다.
- **Catmull-Rom spline** 문서에서는 $a = -0.5$에서 3차 오차 Error를 가장 적게 만들면서, 이미지를 부드럽고 이쁘게 만들다고 설명했다.
- 1차 보간 때처럼 X, Y, Z 순서로 해당 식을 적용한다. $$h(u,v,w) = h(u)h(v)h(w)$$
- 1차 보간은 $2 * 2 * 2 = 8$ 개의 복셀만 봤지만 3차 보간은 각 축마다 4개씩 봐야 하므로 $4 * 4 * 4 = 64$개의 복셀을 계산에 참여시켜야 하기 때문에 계산량이 1차 보간보다 훨씬 많다.
### Gaussian
- 0차(Nearest), 1차(Linear), 3차(Cubic) 보간법은 모두 **격자 보간(grid-interpolating)** 방식이었던 것에 반해 Gaussian은 **비보간 (Non-interpolating) 방식**이다.
$$h(v,u,w) = b \\cdot e^{-a(u^2+v^2+w^2)}$$
	- $u, v, w$ : 중심으로부터의 거리
	- $u^2+v^2+w^2$ : 원점에서의 거리의 제곱이다. 즉, **방향에 상관없이 거리에 따라 똑같이 작용(Radially Symmetric)하다.**
	- $a$ : 필터의 폭(width)를 결정한다. $a$가 크면 뽀족한 종 모양, 작으면 펑퍼짐한 모양이 된다.
	- $b$ : **크기(scale factor)를** 조절하는 계수
-  $e$를 사용하기 때문에 미분이 무한 번 가능할 정도로 아주 부드럽다.

# Interpolation Weight Filter Kernel Graph
![[box, linear, cubic, gaussian filters.png]]
- 위치 $x = 0$에서 거리가 멀어질 수록, 그 주변 점들의 영향을 얼마나 받을지 나타낸 그림이다
	- 가로축 (X축) : 구하려는 위치로부터의 **거리**
	- 세로축 (Y축) : **가중치(Weight)**, 즉 반영 비율 (0이면 무시, 1이면 사용)
- **검은선 (Box Filter)** : 직사각형 모양 (거리가 0.5 이내이면 1, 아니면 0)
- **자홍색 (Linear Filter)** : 삼각형 모양 (거리가 멀어질 수록 일정하게 영향이 줄어든다.)
- **파란색 (Cubic Filter)** : 부드러운 곡선 (음수 값을 가지는 구간을 이미지를 선명하게 만드는 효과를 가진다.) / 하지만 음수 가중치 때문에 원래 데이터에 없던 값이 튀어나오는 **링잉(Ringing) 현상**이 생길 수 있다.
- **빨간색 (Gaussian Filter)** : 종 모양 (가장 높고 부드럽게 줄어들지만, 약간 **흐릿해지는(Blurring) 경향**이 있다.)
# Aliasing
- 데이터를 너무 드문드문 샘플링하면, 원래 신호에 없던 이상한 패턴이 생긴다. (Ex : 특정 패턴의 물줄기가 중력 반대 방향으로 거슬러 올라가는 현상)
- 이미 Aliasing이 생긴 뒤에는 고칠 수 없으므로, 샘플링 전에 미리 고주파 성분을 제거하는 **Pre-filtering**이 필요하다.
![[Aliasing.png]]
- (a) 원본 : 방상형을 퍼지는 촘촘한 선들의 이미지
- (b) 드문드문 샘플링 : 띄엄띄엄 샘플링을 하여, 원본에 없던 이상한 소용돌이 무늬가 생김
- (d) **Pre-filtering** : 샘플링 전에 미리 흐릿하게 뭉개 놓은 이미지
- (e) : 뭉갠 후 샘플링을 하면 이상한 소용돌이 무늬 대신 그냥 회색으로 나온다.
# Gradient
- 볼륨 랜더링에서 빛 반사 효과(Shading)를 주려면, 표면의 방향성을 나타내는 **법선 벡터(Normal vector)가** 필요하다.
- **법선 벡터:** 빛을 계산하려면 "이 표면이 어디를 바라보고 있는지"를 알아야 하는데, 볼륨 데이터에는 딱딱한 껍데기(표면)가 없다.
- 대신 **밀도가 가장 급격하게 변하는 방향(그라디언트)을** 표면이 바라보는 방향이라고 가정
- 해당 논문에서는 그라이언트를 구하는 방법으로 **중앙 차분법(Central Differencing)식**을 사용한다.
  $$
  \\begin{align*} 
  g_x &= \\frac{V(x+1, y, z) - V(x-1, y,z)}{2}\\\\
  g_y &=  \\frac{V(x,y+1,z) - V(x,y-1,z)}{2} \\\\
  g_z &= \\frac{V(x,y,z+1)-V(x,y,z-1)}{2}
  \\end{align*}
  $$
  - $g_x, g_y, g_z$ = X축, Y축, Z축 방향의 기울기(변화율)
  - $V(x+1, ...)$ : 기준 값 바로 오른쪽 옆 칸의 값 ($y,z$도 동일)
  - $V(x-1, ...)$ : 기준 값 바로 왼쪽 옆 칸의 값 ($y,z$도 동일)
- 해당 그라이언트 백터($g_x, g_y, g_z$ )는 법선 벡터 역할을 한다.
- 값이 확 변한다는 것은 그곳에 **'물질의 경계(Boundary)'가** 있다는 뜻이고 값이 변하는 그 방향(화살표)이 바로 경계면이 바라보는 방향(법선 벡터)이 된다.
`;

export default function Post() {
  const dbData = new Date('2025-10-23T10:00:00');
  const formattedDate = format(dbData, 'MMM dd, yyyy');
  const minutesToRead = 10;

  return (
    <div className='grid grid-cols-1 md:grid-cols-[1fr_280px] xl:grid-cols-[1fr_280px]'>
      <div className='flex flex-col gap-4 mx-3'>
        <HierarchyBar
          hierarchy={[
            { category: 'Algorithm' },
            { category: 'Array' },
            { category: 'Binary Search' },
          ]}
        />
        <h1 className='text-6xl font-bold'>Algorithm Introduction</h1>
        <div className='flex items-center justify-end gap-5'>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Calendar className='size-4' />
            <span className='text-sm font-medium'>{formattedDate}</span>
          </div>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Clock className='size-4' />
            <span className='text-sm font-medium'>{minutesToRead} min read</span>
          </div>
        </div>
        <Separator />
        {/* 본문 내용 렌더링 */}
        <MarkdownrRender content={markdownContent} />
      </div>
      <div className='hidden md:block'>오른쪽</div>
    </div>
  );
}
