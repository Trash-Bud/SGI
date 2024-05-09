#version 300 es
precision highp float;

in vec4 vFinalColor;
in vec2 vTextureCoord;

out vec4 fragColor;

uniform sampler2D uSampler;

uniform bool uUseTexture;

uniform float timeFactor;
uniform vec4 expandedColor;
uniform sampler2D material;

void main() {
	// Branching should be reduced to a minimal. 
	// When based on a non-changing uniform, it is usually optimized.
	if (uUseTexture)
	{
		vec4 textureColor = texture(uSampler, vTextureCoord);
		fragColor = mix(textureColor * vFinalColor, expandedColor, timeFactor);
	}
	else
		fragColor = mix(vFinalColor, expandedColor, timeFactor);

}