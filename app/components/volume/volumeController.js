angular.module('volume', [])
.controller('VolumeController', ['$scope', '$state', '$transition$', 'VolumeService', 'ContainerService', 'Notifications',
function ($scope, $state, $transition$, VolumeService, ContainerService, Notifications) {

  $scope.removeVolume = function removeVolume() {
    $('#loadingViewSpinner').show();
    VolumeService.remove($scope.volume)
    .then(function success(data) {
      Notifications.success('Volume successfully removed', $transition$.params().id);
      $state.go('volumes', {});
    })
    .catch(function error(err) {
      Notifications.error('Failure', err, 'Unable to remove volume');
    })
    .finally(function final() {
      $('#loadingViewSpinner').hide();
    });
  };

  function getVolumeDataFromContainer(container, volumeId) {
    return container.Mounts.find(function(volume) {
      return volume.Name === volumeId;
    });
  }

  function initView() {
    $('#loadingViewSpinner').show();
    VolumeService.volume($transition$.params().id)
    .then(function success(data) {
      var volume = data;
      $scope.volume = volume;
      var containerFilter = { volume: [volume.Id] };
      return ContainerService.containers(1, containerFilter);
    })
    .then(function success(data) {
      var containers = data.map(function(container) {
        container.volumeData = getVolumeDataFromContainer(container, $scope.volume.Id);
        return container;
      });
      $scope.containersUsingVolume = containers;
    })
    .catch(function error(err) {
      Notifications.error('Failure', err, 'Unable to retrieve volume details');
    })
    .finally(function final() {
      $('#loadingViewSpinner').hide();
    });
  }

  initView();
}]);
