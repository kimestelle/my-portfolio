import * as THREE from 'three';
import { HOP_PHOTO_ASPECT } from './hopPhoto';

const PHOTO_FOV = 36;
const PHOTO_SAFE_NDC_X = 0.74;
const PHOTO_SAFE_NDC_Y = 0.72;
const PHOTO_VIEW_DIRECTION = new THREE.Vector3(0, -3.02, -7.5).normalize();

function isVisibleRenderMesh(object: THREE.Object3D): object is THREE.Mesh {
  if (!(object instanceof THREE.Mesh) || !object.visible) return false;
  const materials = Array.isArray(object.material)
    ? object.material
    : [object.material];
  return materials.some((material) => material.visible);
}

export function getPhotoSubjectBounds(objects: THREE.Object3D[]) {
  const bounds = new THREE.Box3();
  const uniqueObjects = new Set(objects);

  uniqueObjects.forEach((object) => {
    if (!isVisibleRenderMesh(object)) return;
    if (object instanceof THREE.SkinnedMesh) object.skeleton.update();
    bounds.expandByObject(object, true);
  });

  return bounds;
}

export function framePhotoCamera(
  camera: THREE.PerspectiveCamera,
  subjectBounds: THREE.Box3,
) {
  const bounds = subjectBounds.clone();
  const subjectSize = bounds.getSize(new THREE.Vector3());
  const frameCenter = bounds.getCenter(new THREE.Vector3());
  frameCenter.y -= subjectSize.y * 0.035;

  camera.aspect = HOP_PHOTO_ASPECT;
  camera.fov = PHOTO_FOV;
  camera.position.copy(frameCenter).addScaledVector(PHOTO_VIEW_DIRECTION, -1);
  camera.lookAt(frameCenter);
  camera.updateMatrixWorld(true);

  const inverseCameraQuaternion = camera.quaternion.clone().invert();
  const verticalTangent = Math.tan(THREE.MathUtils.degToRad(PHOTO_FOV) / 2);
  const horizontalTangent = verticalTangent * HOP_PHOTO_ASPECT;
  const corner = new THREE.Vector3();
  const cameraLocalCorner = new THREE.Vector3();
  let cameraDistance = 0;

  for (let xIndex = 0; xIndex < 2; xIndex += 1) {
    for (let yIndex = 0; yIndex < 2; yIndex += 1) {
      for (let zIndex = 0; zIndex < 2; zIndex += 1) {
        corner.set(
          xIndex === 0 ? bounds.min.x : bounds.max.x,
          yIndex === 0 ? bounds.min.y : bounds.max.y,
          zIndex === 0 ? bounds.min.z : bounds.max.z,
        );
        cameraLocalCorner
          .copy(corner)
          .sub(frameCenter)
          .applyQuaternion(inverseCameraQuaternion);
        cameraDistance = Math.max(
          cameraDistance,
          cameraLocalCorner.z
            + Math.abs(cameraLocalCorner.x)
              / (horizontalTangent * PHOTO_SAFE_NDC_X),
          cameraLocalCorner.z
            + Math.abs(cameraLocalCorner.y)
              / (verticalTangent * PHOTO_SAFE_NDC_Y),
        );
      }
    }
  }

  cameraDistance = Math.max(cameraDistance * 1.02, subjectSize.length() * 0.8);
  camera.position
    .copy(frameCenter)
    .addScaledVector(PHOTO_VIEW_DIRECTION, -cameraDistance);
  camera.near = Math.max(0.01, cameraDistance - subjectSize.length() * 1.2);
  camera.far = cameraDistance + subjectSize.length() * 4 + 20;
  camera.lookAt(frameCenter);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
}
