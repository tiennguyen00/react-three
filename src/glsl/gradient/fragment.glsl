varying vec2 vUv;
uniform vec3 uStartColor;
uniform vec3 uEndColor;

float random2d(vec2 n) 
{
  return fract(sin(dot(n, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() 
{
  vec3 finalColor = mix(uStartColor, uEndColor, vUv.y);
  gl_FragColor = vec4(finalColor, 1.0);
}