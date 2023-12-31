'''
앙상블 기법:
개념:
앙상블 기법은 여러 모델을 결합하여 단일 모델보다 더 나은 성능을 달성하는 기법입니다. 이는 여러 명이 모여 더 뛰어난 결정을 내리는 것과 유사한 개념입니다.

1. 스태킹(Stacking):
개념:
스태킹은 여러 모델을 조합하여 하나의 메타 모델을 만드는 기법입니다.

과정:

데이터를 학습용(training)과 테스트용(test)으로 나눕니다.
여러 개의 기본 모델을 학습시킵니다.
학습된 기본 모델들을 사용하여 테스트 데이터에 대한 예측을 수행합니다.
기본 모델들이 만든 예측값을 학습용 데이터로 사용하여 메타 모델을 학습시킵니다.
학습된 메타 모델을 사용하여 테스트 데이터에 대한 최종 예측을 수행합니다.
장점:

다양한 모델을 조합해 성능 향상이 가능합니다.
Overfitting을 방지하고 일반화 성능을 향상시킬 수 있습니다.
단점:

복잡한 구조로 인해 모델 해석이 어려울 수 있습니다.
모델 학습 및 예측에 시간이 오래 걸릴 수 있습니다.

2. 부스팅(Boosting):
개념:
부스팅은 약한 학습기들을 순차적으로 학습시켜 앞의 모델이 틀린 부분을 다음 모델이 보완하는 방식입니다.

과정:

초기에는 모든 데이터에 동일한 가중치를 부여하고, 각 모델이 학습될 때마다 오분류된 데이터에 가중치를 높여주면서 학습합니다.
순차적으로 약한 모델들을 학습시켜 예측하고, 이를 결합하여 최종 예측을 수행합니다.
각 모델의 예측 결과에 일정한 가중치를 적용하여 최종 예측을 계산합니다.
장점:

성능 향상이 크고, 다양한 데이터셋에 적용 가능합니다.
Overfitting을 줄이는 효과가 있습니다.
단점:

모델 복잡성이 증가하고, 모델 해석이 어려울 수 있습니다.
하이퍼파라미터 튜닝이 필요하며, 학습에 시간이 오래 걸릴 수 있습니다.
'''